import { useState } from 'react';
import Loader from '../../ui/loader/Loader';
import './BackupForm.css';
import DurationSlider from '../../ui/DurationSlider/DurationSlider';
import ActionButton from '../action-button/ActionButton';
import Btn from '../../ui/btn/Btn';
import {
  isValidLinuxPath,
  isValidWindowsPath,
} from './../../../../electron/utils/functions/path';
import { useRecoilState } from 'recoil';
import { osPlatformState } from '../../../store/os.store';

const BackupForm = (props) => {
  const [osPlatform, setOsPlatform] = useRecoilState(osPlatformState);
  const initialBackup = {
    name: '',
    path: 'اضغط ﻹختيار موقع',
    deleteDuration: 100,
    os: osPlatform,
  };

  const [backup, setBackup] = useState(initialBackup);
  const [isDurationDisabled, setDurationDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [triedToAdd, setTriedToAdd] = useState(false);

  const selectFolderHandler = () => {
    e_backups.openDirectory((err, path) => {
      if (err) {
        return alert('فشل اختيار الموقع');
      }

      if (path?.filePaths[0]) {
        setBackup((_backup) => {
          return {
            ..._backup,
            path: path?.filePaths[0],
          };
        });
      }
    });
  };

  const submitHandler = () => {
    if (!backup.name) {
      return alert('يجب اضافة اسم');
    }

    if (backup.deleteDuration == undefined || 0 > backup.deleteDuration > 120) {
      return alert('فترة الحذف غير صحيحة');
    }

    if (!backup.os || (backup.os != 'linux' && backup.os != 'win32')) {
      return alert('خطا في التعرف على النظام');
    }

    let isPathValid;
    if (backup.os == 'win32') {
      isPathValid = isValidWindowsPath(backup.path);
    } else if (backup.os == 'linux') {
      isPathValid = isValidLinuxPath(backup.path);
    }

    if (!backup.path || !isPathValid) {
      return alert('يجب اضافة عنوان للخزن');
    }

    e_backups.addBackup(backup, (err, result) => {
      if (err) {
        return alert('فشل اضافة حذف مؤقت');
      }

      if (result) {
        props.onSaveBackup();
        return alert('تم اضافة النسخ الاحتياطي');
      }
    });
  };

  return (
    <div className="backup-form">
      <h2 className="backup-form_header title">اضافة نسخ احتياطي</h2>

      {loading ? (
        <Loader />
      ) : (
        <div className="backup-form_content">
          <div className="input-row">
            <div className="input-container">
              <label htmlFor="name">عنوان النسخ الاحتياطي: </label>
              <input
                dir="ltr"
                type="text"
                id="name"
                name="name"
                value={backup.name}
                onChange={(e) => {
                  if (!e) return;
                  setBackup((_backup) => {
                    return { ..._backup, name: e.target.value };
                  });
                }}
              />
            </div>
            <div className="input-container short">
              <label htmlFor="slider">بدون حذف: </label>
              <input
                type="checkbox"
                value={isDurationDisabled}
                onChange={(e) => {
                  if (!e) return;
                  const value = e.target.value == 'true' ? true : false;
                  if (!value) {
                    setBackup((_backup) => {
                      return { ..._backup, deleteDuration: 0 };
                    });
                  }

                  setDurationDisabled(!value);
                }}
                name="durationDisabled"
                id="durationDisabled"
              />
            </div>
            <div className="input-container">
              <label htmlFor="slider">فترة الحذف: </label>
              <DurationSlider
                value={backup.deleteDuration}
                onChange={(e) => {
                  if (!e) return;
                  setBackup((_backup) => {
                    return { ..._backup, deleteDuration: e.target.value };
                  });
                }}
                disabled={isDurationDisabled}
              ></DurationSlider>
            </div>
          </div>

          <div className="input-row">
            <div className="input-container">
              <label htmlFor="name">موقع النسخ الاحتياطي: </label>

              <input
                dir="ltr"
                type="text"
                value={backup.path}
                onClick={selectFolderHandler}
                readOnly={true}
                className="select-folder-input"
              />
            </div>
          </div>

          <div className="input-row">
            <Btn onClick={submitHandler} className="backups-page_action-button">
              اضافة نسخ احتياطي
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupForm;
