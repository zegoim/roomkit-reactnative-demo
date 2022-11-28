
export interface SelectItem {
  content: string;
  value: number;
}
export interface SelectModalList {
  title: string;
  items: SelectItem[];
}

export interface ClassInfo {
  attendee_count: number;
  begin_timestamp: number;
  create_timestamp: number;
  duration: number;
  end_timestamp: number;
  locked: number;
  max_attendee_count: number;
  max_user_count: number;
  pid: number;
  room_id: string;
  room_type: ClassType;
  status: number;
  subject: string;
  user_role: number;
}

export enum Env {
  MainLand = 1,
  OverSeas = 2,
}

export enum ClassType {
  Class_1V1 = 3,
  CLASS_SMALL = 1,
  CLASS_LARGE = 5,
}
