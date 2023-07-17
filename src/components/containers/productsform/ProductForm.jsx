import './ProductForm.css';

import React, { useCallback } from 'react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Btn from '../../ui/btn/Btn';

function ProductForm(props) {
  const [product, setProduct] = useState({
    title: '',
    price: 0,
    payPeriodType: 'monthly',
    upFrontPaymentAmount: 0,
    periodicalPaymentAmount: 0,
    desc: '',
    image: null,
  });

  const [imageName, setImageName] = useState('');
  const [triedToAdd, setTriedToAdd] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const image = acceptedFiles[0];
    console.log(image);

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
        setProduct((_product) => {
          return { ..._product, image: binaryStr };
        });
      };

      reader.readAsArrayBuffer(image);
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  let payPersentageOptions = [];
  for (let i = 0; i < 20; i++) {
    payPersentageOptions.push(
      <option key={i} value={i / 20}>
        {i * 5}%
      </option>
    );
  }

  const addProduct = () => {
    setTriedToAdd(true);
    if (
      !product.title ||
      !product.price ||
      !product.periodicalPaymentAmount ||
      !product.upFrontPaymentAmount ||
      product.periodicalPaymentAmount > product.price ||
      product.upFrontPaymentAmount > product.price
    ) {
      return alert('تأكد من ادخال المعلومات بشكل صحيح');
    }

    e_products.addProduct(product);
  };

  const deleteImage = () => {
    setProduct((_product) => {
      return { ..._product, image: null };
    });
    setImageName('');
  };

  return (
    <div className="products-form">
      <h2 className="title">اضافة سلعة</h2>
      <div className="inputs-control">
        <div className="input-continaer">
          <label htmlFor="title">عنوان السلعة: </label>
          <input
            type="text"
            id="title"
            name="title"
            className={!product.title && triedToAdd ? 'unvalid' : ''}
            value={product.title}
            onChange={(e) => {
              setProduct((_product) => {
                return { ...product, title: e.target.value };
              });
            }}
          />
        </div>

        <div className="input-contianer">
          <label htmlFor="price">السعر: </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            className={!product.price && triedToAdd ? 'unvalid' : ''}
            onChange={(e) => {
              setProduct((_product) => {
                return { ...product, price: Number(e.target.value) };
              });
            }}
          />
        </div>
      </div>
      <div className="inputs-control upFront-inputs">
        <div className="input-container">
          <label htmlFor="payPersentage">المقدم (نسبة): </label>
          <select
            id="payPersentage"
            onChange={(e) => {
              setProduct((_product) => {
                console.log(_product);
                return {
                  ..._product,
                  upFrontPaymentAmount: Math.round(
                    _product.price * e.target.value
                  ),
                };
              });
            }}
          >
            {payPersentageOptions}
          </select>
        </div>
        <div className="input-continer">
          <label htmlFor="upFrontPaymentAmount">المقدم: </label>
          <input
            type="number"
            id="upFrontPaymentAmount"
            name="upFrontPaymentAmount"
            value={product.upFrontPaymentAmount}
            className={
              (!product.upFrontPaymentAmount && triedToAdd) ||
              product.upFrontPaymentAmount > product.price
                ? 'unvalid'
                : ''
            }
            onChange={(e) => {
              setProduct((_product) => {
                return {
                  ...product,
                  upFrontPaymentAmount: Number(e.target.value),
                };
              });
            }}
          />
        </div>
      </div>
      <div className="inputs-control">
        <div className="input-container">
          <label htmlFor="payPeriodType">نوع القسط: </label>
          <select
            name="payPeriodType"
            id="payPeriodType"
            value={product.payPeriodType}
            onChange={(e) => {
              setProduct((_product) => {
                return { ...product, payPeriodType: e.target.value };
              });
            }}
          >
            <option value="weekly">اسبوعيا</option>
            <option value="monthly">شهريا</option>
            <option value="yearly">سنويا</option>
          </select>
        </div>
        <div className="input-container">
          <label htmlFor="payPersentage">القسط (نسبة): </label>
          <select
            id="payPersentage"
            onChange={(e) => {
              setProduct((_product) => {
                console.log(_product);
                return {
                  ..._product,
                  periodicalPaymentAmount: Math.round(
                    _product.price * e.target.value
                  ),
                };
              });
            }}
          >
            {payPersentageOptions}
          </select>
        </div>

        <div className="input-container">
          <label htmlFor="periodicalPaymentAmount">القسط: </label>
          <input
            type="number"
            id="periodicalPaymentAmount"
            name="periodicalPaymentAmount"
            value={product.periodicalPaymentAmount}
            className={
              (!product.periodicalPaymentAmount && triedToAdd) ||
              product.periodicalPaymentAmount > product.price
                ? 'unvalid'
                : ''
            }
            onChange={(e) => {
              setProduct((_product) => {
                return {
                  ...product,
                  periodicalPaymentAmount: Number(e.target.value),
                };
              });
            }}
          />
        </div>
      </div>
      <p>الملاحظات: </p>
      <textarea
        name="desc"
        value={product.desc}
        onChange={(e) => {
          setProduct((_product) => {
            return {
              ...product,
              desc: e.target.value,
            };
          });
        }}
        id="desc"
        rows="10"
      ></textarea>

      <div className="image-dragndrop_container">
        {product.image ? (
          <p className="image-placeholder" onDoubleClick={deleteImage}>
            {imageName}
          </p>
        ) : (
          <div className="image-dragndrop" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>ضع الصورة هنا</p>
            ) : (
              <p>اسحب صورة للسلعة وضعها هنا (اختياري)</p>
            )}
          </div>
        )}
      </div>

      <Btn onClick={addProduct}>اضافة</Btn>
    </div>
  );
}

export default ProductForm;
