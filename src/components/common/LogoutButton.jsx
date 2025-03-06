import * as React from 'react';
import { AlertDialog } from '@base-ui-components/react/alert-dialog';
import styles from "./../../styles/logout.module.css"
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/AxiosUser';

const LogoutButton = () => {

  const navigate = useNavigate();
  //Logout user and remove token from local storage
  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem('token');
      navigate('/');
    }
  };


  return (
    <div className={styles.Start}>
    <AlertDialog.Root>
      <AlertDialog.Trigger data-color="red" className={styles.Button}>
        Logout
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className={styles.Backdrop} />
        <AlertDialog.Popup className={styles.Popup}>
          <AlertDialog.Title className={styles.Title}>
          Are you sure you want to logout?
          </AlertDialog.Title>
          <AlertDialog.Description className={styles.Description}>
            You can't undo this action.
          </AlertDialog.Description>
          <div className={styles.Actions}>
            <AlertDialog.Close className={styles.Button}>Cancel</AlertDialog.Close>
            <AlertDialog.Close data-color="red" className={styles.Button} onClick={handleLogout}>
              Continue
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
    </div>
  );
}

export default LogoutButton