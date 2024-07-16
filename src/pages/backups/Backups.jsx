import { useEffect, useState } from 'react';
import './Backups.css';
import Loader from '../../components/ui/loader/Loader';
import { DataGrid, renderActionsCell } from '@mui/x-data-grid';
import Btn from '../../components/ui/btn/Btn';
import deleteBtn from './../../assets/Delete-button.svg';

const Backups = (props) => {
  const [backups, setBackups] = useState([]);

  const [loading, setLoading] = useState(false);

  const deleteBackupHandler = (backupId) => {
    if (!backupId) return;

    if (
      !confirm(`هل انت متاكد من حذف النسخ الاحتياطي؟
ستتوقف عمليات النسخ الاحياطي ولكن النسخ الاحتياطية السابقة لن تتأثر
    `)
    ) {
      return;
    }

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
      field: 'deleteDuration',
      headerName: 'فترة الحذف',
      width: 150,
      type: 'text',
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
        console.log();
        setBackups(result.map((backup) => ({ id: backup._id, ...backup })));
        setLoading(false);
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
