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
    periodicalPaymentAmount: 0,
    desc: '',
    image: null,
  });

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
        console.log(31231231212);
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
        setProduct((_product) => {
          return { ...product, image: binaryStr };
        });
        console.log(Buffer.from(binaryStr));
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
      product.periodicalPaymentAmount > product.price
    ) {
      return alert('تأكد من ادخال المعلومات بشكل صحيح');
    }
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
            type="text"
            id="price"
            name="price"
            value={product.price}
            className={!product.price && triedToAdd ? 'unvalid' : ''}
            onChange={(e) => {
              setProduct((_product) => {
                return { ...product, price: e.target.value };
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
            type="text"
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
                  periodicalPaymentAmount: Math.round(e.target.value),
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

      <div className="image-dragndrop" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>ضع الصورة هنا</p>
        ) : (
          <p>اسحب صورة للسلعة وضعها هنا (اختياري)</p>
        )}
      </div>

      <Btn onClick={addProduct}>اضافة</Btn>
    </div>
  );
}

export default ProductForm;
