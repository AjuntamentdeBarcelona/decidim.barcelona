import { 
  FETCH_ACTION_PLANS, 
  FETCH_ACTION_PLAN,
  FETCH_ACTION_PLAN_PROPOSALS,
  APPEND_ACTION_PLANS_PAGE,
  DELETE_ACTION_PLAN,
  UPDATE_ACTION_PLAN,
  ADD_ACTION_PLAN_PROPOSAL,
  REMOVE_ACTION_PLAN_PROPOSAL
} from './action_plans.actions';

export const actionPlans = function (state = [], action) {
  switch (action.type) {
    case FETCH_ACTION_PLANS:
      return action.payload.data.action_plans
    case APPEND_ACTION_PLANS_PAGE:
      return [
        ...state,
        ...action.payload.data.action_plans
      ];
    case FETCH_ACTION_PLAN:
      return [
        ...state,
        action.payload.data.action_plan
      ];
    case FETCH_ACTION_PLAN_PROPOSALS:
    case ADD_ACTION_PLAN_PROPOSAL:
    case REMOVE_ACTION_PLAN_PROPOSAL:
      return state.map(ap => actionPlan(ap, action));
  }
  return state;
}

export const actionPlan = function (state = {}, action) {
  switch (action.type) {
    case UPDATE_ACTION_PLAN:
      return {
        ...state,
        ...action.payload.data.action_plan
      };
    case FETCH_ACTION_PLAN_PROPOSALS:
    case ADD_ACTION_PLAN_PROPOSAL:
    case REMOVE_ACTION_PLAN_PROPOSAL:
      console.log(action.actionPlanId);
      console.log(state.id);
      if (action.actionPlanId !== state.id) {
        let proposals = action.payload.data.proposals;

        return {
          ...state,
          proposals: []
        };
      }
      return state;
    case DELETE_ACTION_PLAN:
      return {
        ...state,
        deleted: true
      };
  }
  return state;
}