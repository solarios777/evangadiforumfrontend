import styles from './EditQuestion.module.css';

const EditQuestion = ({ editedQuestion, setEditedQuestion, handleSave, handleCancel }) => {
    return (
        <div className={styles.editContainer}>
        <input
            type="text"
            value={editedQuestion.title}
            onChange={(e) =>
            setEditedQuestion((prev) => ({ ...prev, title: e.target.value }))
            }
            className={styles.editInput}
        />
        <textarea
            value={editedQuestion.content}
            onChange={(e) =>
            setEditedQuestion((prev) => ({ ...prev, content: e.target.value }))
            }
            className={styles.editTextarea}
        />
        <div className={styles.editActions}>
            <button type="button" onClick={handleSave} className={styles.saveButton}>
            Save
            </button>
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            Cancel
            </button>
        </div>
        </div>
    );
};

export default EditQuestion;