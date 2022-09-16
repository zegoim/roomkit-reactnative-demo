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
  room_type: number;
  status: number;
  subject: string;
  user_role: number;
}
