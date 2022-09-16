import { CreateGoalRequest, CreateGoalErrors, GetUserGoalsRequest } from "@goal-tracker/shared/src/api/Requests/Goal";
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