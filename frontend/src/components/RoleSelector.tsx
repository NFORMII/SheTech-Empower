import React from 'react';
import { useTranslation } from 'react-i18next';

interface Role {
  id: string;
}
interface RoleSelectorProps {
  onSelectRole: (id: string) => void;
  selectedRole?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onSelectRole,
  selectedRole
}) => {
  const { t } = useTranslation();

  const roles: Role[] = [
    { id: 'youth' },
    { id: 'mentor' },
    { id: 'donor' },
    { id: 'admin' }
  ];

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-md">
      <h2 className="text-lg font-montserrat font-medium text-gray-700">
        {t('roles.heading')}
      </h2>
      <div className="grid grid-cols-1 gap-4 w-full">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`p-4 rounded-xl text-left transition-all border-2 ${
              selectedRole === role.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            <p className="font-montserrat font-medium text-base">
              {t(`roles.${role.id}.name`)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t(`roles.${role.id}.description`)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
