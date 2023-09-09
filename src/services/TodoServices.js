import moment from "moment";

export default class TodoService {
  isOverdue = (due) => {
    const isPastDueDate = moment().diff(due);

    if (isPastDueDate > 0) {
      return true;
    } else {
      return false;
    }
  };
}
