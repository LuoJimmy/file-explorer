/**
 * 权限控制工具
 */

/**
 * 权限类型
 */
export type Permission = string

/**
 * 角色类型
 */
export type Role = string

/**
 * 权限配置
 */
export interface PermissionConfig {
  roles: Role[]
  permissions: Permission[]
  rolePermissions: Record<Role, Permission[]>
}

/**
 * 默认权限配置
 */
export const defaultPermissionConfig: PermissionConfig = {
  roles: ['admin', 'user', 'guest'],
  permissions: [
    'read',
    'write',
    'delete',
    'execute',
    'manage_users',
    'manage_roles',
    'manage_permissions'
  ],
  rolePermissions: {
    admin: [
      'read',
      'write',
      'delete',
      'execute',
      'manage_users',
      'manage_roles',
      'manage_permissions'
    ],
    user: ['read', 'write', 'execute'],
    guest: ['read']
  }
}

/**
 * 权限管理器
 */
export class PermissionManager {
  private config: PermissionConfig
  private userRoles: Role[] = []
  private userPermissions: Permission[] = []

  constructor(config: Partial<PermissionConfig> = {}) {
    this.config = { ...defaultPermissionConfig, ...config }
  }

  /**
   * 设置用户角色
   * @param roles 角色列表
   */
  setUserRoles(roles: Role[]): void {
    this.userRoles = roles
    this.updateUserPermissions()
  }

  /**
   * 获取用户角色
   * @returns 角色列表
   */
  getUserRoles(): Role[] {
    return [...this.userRoles]
  }

  /**
   * 获取用户权限
   * @returns 权限列表
   */
  getUserPermissions(): Permission[] {
    return [...this.userPermissions]
  }

  /**
   * 更新用户权限
   */
  private updateUserPermissions(): void {
    const permissions = new Set<Permission>()
    for (const role of this.userRoles) {
      const rolePermissions = this.config.rolePermissions[role] || []
      for (const permission of rolePermissions) {
        permissions.add(permission)
      }
    }
    this.userPermissions = Array.from(permissions)
  }

  /**
   * 检查是否有指定角色
   * @param role 角色
   * @returns 是否有该角色
   */
  hasRole(role: Role): boolean {
    return this.userRoles.includes(role)
  }

  /**
   * 检查是否有指定权限
   * @param permission 权限
   * @returns 是否有该权限
   */
  hasPermission(permission: Permission): boolean {
    return this.userPermissions.includes(permission)
  }

  /**
   * 检查是否有所有指定权限
   * @param permissions 权限列表
   * @returns 是否有所有权限
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission))
  }

  /**
   * 检查是否有任意指定权限
   * @param permissions 权限列表
   * @returns 是否有任意权限
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission))
  }

  /**
   * 添加角色
   * @param role 角色
   * @param permissions 权限列表
   */
  addRole(role: Role, permissions: Permission[]): void {
    if (!this.config.roles.includes(role)) {
      this.config.roles.push(role)
    }
    this.config.rolePermissions[role] = permissions
  }

  /**
   * 移除角色
   * @param role 角色
   */
  removeRole(role: Role): void {
    const index = this.config.roles.indexOf(role)
    if (index !== -1) {
      this.config.roles.splice(index, 1)
    }
    delete this.config.rolePermissions[role]
  }

  /**
   * 添加权限
   * @param permission 权限
   */
  addPermission(permission: Permission): void {
    if (!this.config.permissions.includes(permission)) {
      this.config.permissions.push(permission)
    }
  }

  /**
   * 移除权限
   * @param permission 权限
   */
  removePermission(permission: Permission): void {
    const index = this.config.permissions.indexOf(permission)
    if (index !== -1) {
      this.config.permissions.splice(index, 1)
    }
    for (const role of this.config.roles) {
      const permissions = this.config.rolePermissions[role]
      const permIndex = permissions.indexOf(permission)
      if (permIndex !== -1) {
        permissions.splice(permIndex, 1)
      }
    }
  }

  /**
   * 获取角色权限
   * @param role 角色
   * @returns 权限列表
   */
  getRolePermissions(role: Role): Permission[] {
    return [...(this.config.rolePermissions[role] || [])]
  }

  /**
   * 设置角色权限
   * @param role 角色
   * @param permissions 权限列表
   */
  setRolePermissions(role: Role, permissions: Permission[]): void {
    this.config.rolePermissions[role] = [...permissions]
  }

  /**
   * 获取所有角色
   * @returns 角色列表
   */
  getAllRoles(): Role[] {
    return [...this.config.roles]
  }

  /**
   * 获取所有权限
   * @returns 权限列表
   */
  getAllPermissions(): Permission[] {
    return [...this.config.permissions]
  }
}

// 创建默认权限管理器实例
export const permissionManager = new PermissionManager()

/**
 * 权限指令
 */
export const permission = {
  mounted(el: HTMLElement, binding: any) {
    const { value } = binding
    if (value) {
      const hasPermission = permissionManager.hasPermission(value)
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    }
  }
}

/**
 * 角色指令
 */
export const role = {
  mounted(el: HTMLElement, binding: any) {
    const { value } = binding
    if (value) {
      const hasRole = permissionManager.hasRole(value)
      if (!hasRole) {
        el.parentNode?.removeChild(el)
      }
    }
  }
}

/**
 * 权限检查函数
 * @param permission 权限
 * @returns 是否有权限
 */
export function checkPermission(permission: Permission): boolean {
  return permissionManager.hasPermission(permission)
}

/**
 * 角色检查函数
 * @param role 角色
 * @returns 是否有角色
 */
export function checkRole(role: Role): boolean {
  return permissionManager.hasRole(role)
}

/**
 * 权限检查函数（所有权限）
 * @param permissions 权限列表
 * @returns 是否有所有权限
 */
export function checkAllPermissions(permissions: Permission[]): boolean {
  return permissionManager.hasAllPermissions(permissions)
}

/**
 * 权限检查函数（任意权限）
 * @param permissions 权限列表
 * @returns 是否有任意权限
 */
export function checkAnyPermission(permissions: Permission[]): boolean {
  return permissionManager.hasAnyPermission(permissions)
}
