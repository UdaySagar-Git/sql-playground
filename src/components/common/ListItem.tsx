import { Edit2, Trash2, Check, X } from "lucide-react";
import styles from "./common.module.css";

interface ListItemProps {
  id: string;
  title: string;
  subtitle?: string;
  isEditing?: boolean;
  editValue?: string;
  onEditValueChange?: (value: string) => void;
  onEditStart?: (id: string, value?: string) => void;
  onEditSave?: () => void;
  onEditCancel?: () => void;
  onSelect?: () => void;
  onDelete?: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  showEditButton?: boolean;
}

export const ListItem = ({
  id,
  title,
  subtitle,
  isEditing = false,
  editValue = "",
  onEditValueChange,
  onEditStart,
  onEditSave,
  onEditCancel,
  onSelect,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  showEditButton = false,
}: ListItemProps) => {
  if (isEditing && onEditValueChange && onEditSave && onEditCancel) {
    return (
      <div className={styles.listItem}>
        <div className={styles.editContainer}>
          <input
            type="text"
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            className={styles.editInput}
            placeholder="Enter display name (optional)"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") onEditSave();
              if (e.key === "Escape") onEditCancel();
            }}
          />
          <div className={styles.editActions}>
            <button
              className={styles.iconButton}
              onClick={onEditSave}
              title="Save"
              disabled={isUpdating}
            >
              <Check size={14} />
            </button>
            <button
              className={styles.iconButton}
              onClick={onEditCancel}
              title="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.listItem}>
      <button
        className={styles.itemButton}
        onClick={onSelect}
      >
        <div className={styles.itemTitle}>
          {title}
        </div>
        {subtitle && (
          <div className={styles.itemSubtitle}>
            {subtitle}
          </div>
        )}
      </button>
      <div className={styles.itemActions}>
        {showEditButton && onEditStart && (
          <button
            className={styles.iconButton}
            onClick={() => onEditStart(id, title)}
            title="Edit name"
            disabled={isUpdating}
          >
            <Edit2 size={14} />
          </button>
        )}
        {onDelete && (
          <button
            className={styles.iconButton}
            onClick={() => onDelete(id)}
            title="Delete"
            disabled={isDeleting}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};