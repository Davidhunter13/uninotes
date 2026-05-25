// ============================================
// EmptyState - Placeholder para listas vacías
// ============================================

import React from 'react';
import { IonIcon, IonButton } from '@ionic/react';

interface Props {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<Props> = ({ icon, title, message, actionLabel, onAction }) => {
  return (
    <div className="empty-state">
      <IonIcon icon={icon} />
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && onAction && (
        <IonButton
          onClick={onAction}
          style={{ marginTop: '16px' }}
          shape="round"
          size="small"
        >
          {actionLabel}
        </IonButton>
      )}
    </div>
  );
};

export default EmptyState;
