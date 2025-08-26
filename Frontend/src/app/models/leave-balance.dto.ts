export interface LeaveBalanceDTO {
  leaveBalanceID: number;
  employeeID: number;
  leaveType: string;
  balance: number;
}

export interface UpdateLeaveBalanceDTO {
  leaveType: string;
  balance: number;
}