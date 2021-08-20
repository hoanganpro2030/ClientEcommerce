class Message {
  public code;
  public english;
  public france;

  constructor(code, english, france = null) {
    this.code = code;
    this.english = english;
    this.france = france;
  }
}

export const STATUS_CODE = {
  PNUM_NULL: new Message(
    "error.project-num.null",
    "The project number can't be null"),
  PNUM_INVAL: new Message(
    "error.project-num.inval",
    "The project number is invalid"),
  PNAME_NULL: new Message(
    "error.project-name.null",
    "The project name can't be null"),
  PCUSTOMER_NULL: new Message(
    "error.project-customer.null",
    "The project customer can't be null"),
  PGROUP_NULL: new Message(
    "error.project-group.null",
    "The project group can't be null"),
  PGROUP_INVAL: new Message(
    "error.project-group.inval",
    "The project group is invalid"),
  PEMP_INVAL: new Message(
    "error.project-emp.inval",
    "The following visa does not exist: "),
  PSTATUS_INVAL: new Message(
    "error.project-status.inval",
    "The project status invalid"),
  PSTARTD_NULL: new Message(
    "error.project-start.null",
    "The start day can't be null"),
  PENDD_INVAL: new Message(
    "error.project-end.inval",
    "Project startDay must not be greater than the project endDate"),
  PDELETE_NOTNEW: new Message(
    "error.project-del.notnew",
    "Only able to delete project have NEW status"),
  PNUM_CHANGE: new Message(
    "error.project-num.change",
    "The project number can't be changed"),
  PNOT_FOUND: new Message(
    "error.project.not-found",
    "Project not found"),
  PCONCUR_UPD: new Message(
    "error.project.concur-upd",
    "Concurrent update"),
  PNUM_EXISTED: new Message(
    "error.project-num.existed",
    "The project number already existed. Please select a different project number"),
  INTERNAL_ERROR: new Message(
    "error.server.internal",
    "Internal server error"),
  PDELETE_OK: new Message(
    "success.project.delete",
    "OK")
}
