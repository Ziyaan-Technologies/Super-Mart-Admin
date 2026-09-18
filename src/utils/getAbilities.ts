import { defineAbilities } from '@/abilities'
import { fetchPermissions } from '../services/permissionService';

export async function getAbilities() {
  const userObject = JSON.parse(localStorage.getItem('userObject') || 'null');

  if (!userObject || !userObject.token) {
    return defineAbilities([])
  }

  let permissions = JSON.parse(localStorage.getItem('permissions') || 'null')

  if (!permissions) {
    permissions = await fetchPermissions()
    localStorage.setItem('permissions', JSON.stringify(permissions))
  }

  return defineAbilities(permissions)
}
