import type { UserRole } from "@/types/database";

export type Permission =
  | "clients:read"
  | "clients:write"
  | "clients:archive"
  | "cases:read"
  | "cases:write"
  | "cases:archive"
  | "hearings:read"
  | "hearings:write"
  | "tasks:read"
  | "tasks:write"
  | "documents:read"
  | "documents:write"
  | "documents:delete"
  | "finance:read"
  | "finance:write"
  | "reports:read"
  | "members:read"
  | "members:manage"
  | "firm:manage"
  | "audit:read";

const ALL: Permission[] = [
  "clients:read",
  "clients:write",
  "clients:archive",
  "cases:read",
  "cases:write",
  "cases:archive",
  "hearings:read",
  "hearings:write",
  "tasks:read",
  "tasks:write",
  "documents:read",
  "documents:write",
  "documents:delete",
  "finance:read",
  "finance:write",
  "reports:read",
  "members:read",
  "members:manage",
  "firm:manage",
  "audit:read",
];

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: ALL,
  office_manager: ALL.filter((p) => p !== "firm:manage"),
  lawyer: [
    "clients:read",
    "clients:write",
    "cases:read",
    "cases:write",
    "hearings:read",
    "hearings:write",
    "tasks:read",
    "tasks:write",
    "documents:read",
    "documents:write",
    "reports:read",
    "members:read",
  ],
  secretary: [
    "clients:read",
    "clients:write",
    "cases:read",
    "cases:write",
    "hearings:read",
    "hearings:write",
    "tasks:read",
    "tasks:write",
    "documents:read",
    "documents:write",
    "members:read",
  ],
  accountant: [
    "clients:read",
    "cases:read",
    "hearings:read",
    "tasks:read",
    "documents:read",
    "finance:read",
    "finance:write",
    "reports:read",
    "members:read",
  ],
};

export function hasPermission(role: UserRole | null | undefined, permission: Permission) {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessFinance(role: UserRole | null | undefined) {
  return hasPermission(role, "finance:read");
}

export function assertPermission(role: UserRole | null | undefined, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error("ليس لديك صلاحية لتنفيذ هذه العملية.");
  }
}
