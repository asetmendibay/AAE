export interface ProfileSessionData {
  readonly data: Uint8Array;
}

export interface ProfileStore {
  load(profileId: string): Promise<ProfileSessionData | undefined>;
  save(profileId: string, sessionData: ProfileSessionData): Promise<void>;
  delete(profileId: string): Promise<void>;
}
