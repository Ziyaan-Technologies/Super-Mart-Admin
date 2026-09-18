import type { profileType } from '@/types/HeaderTypes';
import iconAccount from '@/assets/images/svgs/icon-account.svg';
import iconPassword from '@/assets/images/svgs/icon-password.svg';

const profileDD: profileType[] = [
    {
        avatar: iconAccount,
        title: 'My Profile',
        subtitle: 'Account settings',
        href: '/profile/update-details'
    },
    {
        avatar: iconPassword,
        title: 'Update Password',
        subtitle: 'Account settings',
        href: '/auth/update-password'
    }
];

export { profileDD };
