import { useEffect, useState } from 'react';
import './Backups.css';
import Loader from '../../components/ui/loader/Loader';
import { DataGrid } from '@mui/x-data-grid';
import Btn from '../../components/ui/btn/Btn';

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
];

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
    },
  ]);
  const [loading, setLoading] = useState(false);

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
