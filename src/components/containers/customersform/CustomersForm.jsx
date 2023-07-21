import './CustomersForm.css';

function CustomerForm() {
  const [customersNames, setCustomersNames] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  // Get customers names, get products
  useEffect(() => {
    setLoading(true);
    e_customers.getCustomersNames((err, result) => {
      if (err) {
        return alert('فشل سحب اسماء الزبائن');
      }

      if (result) {
        setCustomersNames(result.customersNames);
      }
    });
  }, []);

  // Function to go fetch a customer
  const fetchCustomer = (_id) => {
    setLoading(true);
  };

  // Function to add a new product
  const addProduct = (product) => {};
  return (
    <div>
      <p>customers form</p>
    </div>
  );
}

export default CustomerForm;
