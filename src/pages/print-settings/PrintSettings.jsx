import './PrintSettings.css';

import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Btn from '../../components/ui/btn/Btn';
import Loader from '../../components/ui/loader/Loader';

function PrintSettings() {
  const [printSettings, setPrintSettings] = useState({
    shopName: '',
    firstPhoneNumber: '',
    secondPhoneNumber: '',
    firstAddress: '',
    secondAddress: '',
    image: null,
  });

  const [imageName, setImageName] = useState('');
  const [triedToAdd, setTriedToAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const image = acceptedFiles[0];

    try {
      if (
        image.type !== 'image/png' &&
        image.type !== 'image/jpg' &&
        image.type !== 'image/jpeg' &&
        image.type !== 'image/bmp'
      ) {
        throw new Error('يجب ان يكون الملف صورة');
      }

      if (image.size > 15000000) {
        throw new Error('حجم الصورة لا يتجاوز ال12 ميكا بايت');
      }

      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.onload = () => {
        const binaryStr = reader.result;
        setImageName(image.name);
        setPrintSettings((_printsettings) => {
          return { ..._printsettings, image: binaryStr };
        });
      };

      reader.readAsArrayBuffer(image);
    } catch (err) {
      alert(err.message);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const deleteImage = () => {
    setPrintSettings((_printsettings) => {
      return { ..._printsettings, image: null };
    });
    setImageName('');
  };

  const saveSettings = () => {
    setTriedToAdd(true);
    if (!printSettings.shopName) {
      return alert('تأكد من أدخال البيانات بصورة صحيحة');
    }

    if (confirm('هل انت متأكد من تغيير معلومات الطباعة ؟')) {
      e_print.setPrintSettings(printSettings, (err, result) => {
        if (err) {
          return alert('فشل حفظ بيانات الطباعة');
        }

        if (result) {
          return alert('تم حفظ البيانات بنجاح');
        }
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    e_print.getPrintSettings((err, result) => {
      setLoading(false);
      if (err) {
        return alert('فشل سحب اعدادات الطباعة');
      }

      if (result) {
        setImageName('logo.png');
        return setPrintSettings({
          shopName: result.shopName,
          firstPhoneNumber: result.firstPhoneNumber,
          secondPhoneNumber: result.secondPhoneNumber,
          firstAddress: result.firstAddress,
          secondAddress: result.secondAddress,
          image: result.image,
        });
      }
    });
  }, []);

  return (
    <div className="print-settings" dir="rtl">
      <h1>اعدادات الطباعة</h1>

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="print-settings_inputs-container">
            <label htmlFor="shopName">اسم المكتب أو المحل: </label>
            <input
              className={!printSettings.shopName && triedToAdd ? 'unvalid' : ''}
              type="text"
              id="shopName"
              name="shopName"
              value={printSettings.shopName}
              onChange={(e) => {
                setPrintSettings((_printsettings) => {
                  return { ..._printsettings, shopName: e.target.value };
                });
              }}
            />
          </div>

          <div className="inputs-control">
            <div className="input-container">
              <label htmlFor="firstPhoneNumber">رقم الهاتف الأول: </label>
              <input
                type="text"
                id="firstPhoneNumber"
                name="firstPhoneNumber"
                value={printSettings.firstPhoneNumber}
                onChange={(e) => {
                  setPrintSettings((_printsettings) => {
                    return {
                      ..._printsettings,
                      firstPhoneNumber: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="input-container">
              <label htmlFor="secondPhoneNumber">رقم الهاتف الثاني: </label>
              <input
                type="text"
                id="secondPhoneNumber"
                name="secondPhoneNumber"
                value={printSettings.secondPhoneNumber}
                onChange={(e) => {
                  setPrintSettings((_printsettings) => {
                    return {
                      ..._printsettings,
                      secondPhoneNumber: e.target.value,
                    };
                  });
                }}
              />
            </div>
          </div>

          <div className="print-settings_inputs-container">
            <label htmlFor="firstAddress">العنوان الأول: </label>
            <input
              type="text"
              id="firstAddress"
              name="firstAddress"
              value={printSettings.firstAddress}
              onChange={(e) => {
                setPrintSettings((_printsettings) => {
                  return {
                    ..._printsettings,
                    firstAddress: e.target.value,
                  };
                });
              }}
            />
          </div>
          <div className="print-settings_inputs-container">
            <label htmlFor="secondAddress">العنوان الثاني: </label>
            <input
              type="text"
              id="secondAddress"
              name="secondAddress"
              value={printSettings.secondAddress}
              onChange={(e) => {
                setPrintSettings((_printsettings) => {
                  return {
                    ..._printsettings,
                    secondAddress: e.target.value,
                  };
                });
              }}
            />
          </div>

          <div className="image-dragndrop_container">
            {printSettings.image ? (
              <p className="image-placeholder" onDoubleClick={deleteImage}>
                {imageName}
              </p>
            ) : (
              <div className="image-dragndrop" {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>ضع الصورة هنا</p>
                ) : (
                  <p>اسحب صورة لشعار المكتب أو المحل وضعها هنا (اختياري)</p>
                )}
              </div>
            )}
          </div>
          <Btn onClick={saveSettings}>حفظ الأعدادت</Btn>
        </Fragment>
      )}
    </div>
  );
}

export default PrintSettings;
