import type { AppAbility } from '@/abilities'
import type { menu } from '../layouts/full/vertical-sidebar/sidebarItem';

export function filterMenuByAbility(menuItems: menu[], ability: AppAbility): menu[] {
  const result: menu[] = []
  
  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i]

    // If it's a header, check if any following non-header items are visible
    if (item.header) {
      // Look ahead for next visible item
      const nextVisibleItems = []

      for (let j = i + 1; j < menuItems.length; j++) {
        const nextItem = menuItems[j]
        if (nextItem.header) break // stop at next header

        // Skip invalid items
        if (!nextItem) continue

        // Check permission
        if (
          !nextItem.action ||
          !nextItem.subject ||
          ability.can(nextItem.action, nextItem.subject)
        ) {
          nextVisibleItems.push(nextItem)
        }
      }

      // If any visible item found, push the header
      if (nextVisibleItems.length > 0) {
        result.push(item)
      }
    }

    // If it's a regular item
    else if (!item.action || !item.subject || ability.can(item.action, item.subject)) {
      result.push(item)
    }
  }

  return result
}
