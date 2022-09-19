import { CreateGoalRequest, CreateGoalErrors, GetUserGoalsRequest, UpdateGoalRequest, UpdateGoalErrors } from "@goal-tracker/shared/src/api/Requests/Goal";
import { TRouteController } from ".";
import { ControllerUtils } from "~Utils/ControllerUtils";
import { TUserDocLocals } from "~Middleware/GetUser.middleware";
import { GoalUtils, TGoal } from "@goal-tracker/shared/src/utils/GoalUtils";
import { JWTUtils } from "~Utils/JWTUtils";
import db from "~Models";

export const CreateGoalController: TRouteController<CreateGoalRequest.TRequest, TUserDocLocals> = async (req, res) => {
	const { user } = res.locals;

	const inputValidationErrors = GoalUtils.ValidateGoalCreationFields(req.body);

	if (Object.keys(inputValidationErrors).length > 0) {
		return ControllerUtils.respondWithErr(CreateGoalErrors.InvalidFieldInput({ invalidFields: inputValidationErrors }), res);
	}

	const newGoal: TGoal = {
		category: req.body.category,
		notes: req.body.notes,
		id: await JWTUtils.generateHash(),
		isComplete: false,
		title: req.body.title
	}

	const isGoalAdded = !!(await user.addGoal(newGoal));

	if (!isGoalAdded) {
		return ControllerUtils.respondWithUnexpectedErr(res, "Unable to save new goal");
	}

	return res.json(newGoal).end();
}

export const GetUserGoalsController: TRouteController<GetUserGoalsRequest.TRequest, TUserDocLocals> = async (req, res) => {
	return res.json(res.locals.user.goals).end();
}

export const UpdateGoalController: TRouteController<UpdateGoalRequest.TRequest, TUserDocLocals> = async (req, res) => {
	const { goalId, goalCategory, ...rest } = req.body;

	if (!goalId || !goalCategory) {
		return ControllerUtils.respondWithErr(UpdateGoalErrors.MissingGoalIdOrCategory({}), res);
	}

	const inputValidationErrors = GoalUtils.ValidateGoalUpdateFields(rest);

	if (Object.keys(inputValidationErrors).length > 0) {
		return ControllerUtils.respondWithErr(UpdateGoalErrors.InvalidFieldInput({ invalidFields: inputValidationErrors }), res);
	}

	const { foundGoal, updatedGoal } = await res.locals.user.updateGoal(goalId, goalCategory, req.body);

	if (!foundGoal) {
		return ControllerUtils.respondWithErr(UpdateGoalErrors.GoalNotFound({}), res);
	} else if (!updatedGoal) {
		return ControllerUtils.respondWithUnexpectedErr(res, "Unable to update goal");
	}

	return res.json({}).end();
}