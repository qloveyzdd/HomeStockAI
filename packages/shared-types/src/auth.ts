export type LoginPayload = {
  phone: string;
  password: string;
};

export type SessionAccount = {
  id: string;
  phone: string;
};

export type AuthSessionResponse = {
  account: SessionAccount | null;
  householdId: string | null;
  setupCompleted: boolean;
};
