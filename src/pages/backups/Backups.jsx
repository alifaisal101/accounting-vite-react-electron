import { useEffect, useState } from 'react';
import './Backups.css';
import Loader from '../../components/ui/loader/Loader';
import { DataGrid, renderActionsCell } from '@mui/x-data-grid';
import Btn from '../../components/ui/btn/Btn';
import deleteBtn from './../../assets/Delete-button.svg';
import editBtn from './../../assets/edit-button.svg';

const Backups = (props) => {
  const [backups, setBackups] = useState([
    {
      id: '21321312312',
      name: 'bksdadsadas',
      path: `C:\abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\\filename.txt`,
      duration: '1' + ' يوم ',
    },
    {
      id: '2132156562312',
      name: 'bk2',
      path: '/home/ali/Desktop/miki2',
      duration: 2 + ' يوم ',
      deleteBtn: '',
    },
  ]);

  const [loading, setLoading] = useState(false);

  const deleteBackupHandler = (backupId) => {
    if (!backupId) return;

    e_backups.deleteBackup(backupId, (err, result) => {
      if (err) {
        console.log(err);
        return alert('فشل الحذف');
      }

      if (result) {
        alert('تم الحذف');
        setBackups((_backups) =>
          _backups.filter((backup) => backup.id !== backupId)
        );
      }
    });
  };

  const columns = [
    {
      field: 'name',
      headerName: 'الأسم',
      width: 150,
      type: 'text',
      editable: false,
    },
    {
      field: 'path',
      headerName: 'عنوان النسخ',
      width: 400,
      type: 'text',
      editable: false,
      cellClassName: 'cellLtr',
    },
    {
      field: 'duration',
      headerName: 'فترة الحذف',
      width: 150,
      type: 'text',
    },
    {
      field: 'editBtn',
      headerName: 'تعديل',
      type: 'text',
      align: 'center',
      cellClassName: 'actionCell',
      renderCell: (params) => {
        return (
          <div
            className="col col-9 edit-btn "
            onClick={() => {
              deleteBackupHandler(params._id);
            }}
          >
            <img src={editBtn} alt="Delete" />
          </div>
        );
      },
    },
    {
      field: 'deleteBtn',
      headerName: 'حذف',
      type: 'text',
      align: 'center',
      cellClassName: 'actionCell',
      renderCell: (params) => {
        return (
          <div className="col col-9 delete-btn ">
            <img
              src={deleteBtn}
              alt="Delete"
              onClick={() => {
                deleteBackupHandler(params.id);
              }}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    e_backups.fetchBackups((err, result) => {
      if (err) {
        return alert('فشل سحب البيانات');
      }

      if (result) {
        setLoading(false);
        console.log(result);
      }
    });
  }, []);

  return (
    <div className="backups-page" dir="rtl">
      <h1 className="backups-page_header">النسخ الاحتياطية</h1>
      {loading ? (
        <div className="loading-container">
          <Loader />
        </div>
      ) : (
        <div className="backups-page_content">
          <Btn className="backups-page_action-button" onClick={props.action}>
            اضافة نسخ احتياطي
          </Btn>
          <DataGrid
            className="backups-page_datagrid"
            rows={backups}
            columns={columns}
          ></DataGrid>
        </div>
      )}
    </div>
  );
};

export default Backups;
