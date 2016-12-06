import _ from 'lodash';
import { calcPercentage } from './general';
import { copyArray } from './immutable';

export const frequencyCheck = (agent) => {
  return (agent.BuyerLeadFrequency > 0 || agent.SellerLeadFrequency > 0);
};

export const agentIsReceiving = (agent) => {
  return agent ? (
    agent.SendLeads && agent.IsApproved && !agent.IsRestricted && !agent.OnPause && !agent.VacationPause
  ) : false;
};

export const agentStatus = (agent, totalWeight) => {
  /*
  The following order of 'status' is very important as there is a hierarchy
  of values, and one needs to override the others.
  OnPause > VacationPause > SendLeads > (showing the percentage if sending leads)
  */
  let status = '';
  if (agent) {
    status = totalWeight ? `${calcPercentage(totalWeight, parseInt(agent.weight, 10))}%` : status;
    status = !agent.SendLeads ? 'Turned Off' : status;
    status = agent.VacationPause ? 'Self Paused' : status;
    status = agent.OnPause ? 'Admin Paused' : status;
    status = agent.IsRestricted ? 'Restricted User' : status;
    status = agent.RoleNames && agent.RoleNames.includes('AgentProfile') ? 'Profile-Only' : status;
  }
  return status;
};

export const inactive = (agent) => {
  return agent ? !agent.IsApproved : false;
};

export const profileOnlyAgent = (agent) => {
  return agent.RoleNames.includes('AgentProfile');
};

/**
 * Case insensitive sort by agent last name, then first name
 */
export const agentNameSortHandler = (agents) => {
  return _.sortBy(agents, [
    (agent) => { return agent.LastName ? agent.LastName.toLowerCase() : agent.LastName; },
    (agent) => { return agent.FirstName ? agent.FirstName.toLowerCase() : agent.FirstName; },
  ]);
};

/**
* For each assignment, find the agent by ID from the list of tenant agents,
* determine the agent's status, accumulate total active agent weight,
* and build an array of assignments that contain agent info.
* @param agentsList an array of the entire tenant's agents.
* @param assignments an array of the assignments for a particular rule
*/
export const buildAgentAssignments = (agentsList, assignments) => {
  // map assignments down to a an array of IDs for indexOf
  const currentAssignments = copyArray(assignments).map((assignment) => assignment.userId);

  // create temporary data structure that stores assignment index with agent object
  const agentAssignments = agentsList.map((agent) => {
    return [
      currentAssignments.indexOf(agent.userId),
      agent,
    ];
  })
  // filter out agents that don't have a matching assignment
  .filter((j) => j[0] !== -1)
  // combine assignment and agent objects, along with agent status
  .map((data) => {
    const assignmentIndex = data[0];
    const agent = data[1];
    return { ...agent, ...assignments[assignmentIndex] };
  });

  // sort and return agent assignments
  return agentNameSortHandler(agentAssignments);
};

/**
 * Given an array of agent assignments for a particular rule, accumulate the
 * totalActiveWeight based on each agent's status.
 * @param agentAssignments an array of assignments for a particular rule that
 * contains full data for each agent.
 */
export const calcTotalActiveWeight = (agentAssignments) => {
  let totalActiveWeight = 0;
  agentAssignments.forEach((a) => {
    if (!agentStatus(a)) {
      totalActiveWeight = totalActiveWeight + parseInt(a.weight, 10);
    }
  });
  return totalActiveWeight;
};
