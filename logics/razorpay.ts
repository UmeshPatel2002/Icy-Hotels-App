import RazorpayCheckout from "react-native-razorpay";

const PayNow = async () => {
    const username = "rzp_live_oz8kr6Ix29mKyC";
    const password = "IADDTICFJ2oXYLX3H2pLjvcx";
    const credentials = ${username}:${password};
    const encodedCredentials = btoa(credentials);
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.razorpay.com/v1/orders",
        {
          amount: 500,
          currency: "INR",
          receipt: userDetails._id,
          notes: {
            notes_key_1: "Welcome to CulturTap-Genie",
            notes_key_2: "Eat-Sleep-Code-Repeat.",
          },
        },
        {
          headers: {
            Authorization: Basic ${encodedCredentials},
            "Content-Type": "application/json",
          },
        }
      );

      const order = response.data;

      var options = {
        description: "Payment for Genie-service",
        image:
          "https://res.cloudinary.com/kumarvivek/image/upload/v1716890335/qinbdiriqama2cw10bz6.png",
        currency: "INR",
        key: "rzp_live_oz8kr6Ix29mKyC",
        amount: "100", // Amount in paise (20000 paise = 200 INR)
        name: "CulturTap-Genie",
        order_id: order.id, // Use the order ID created using Orders API.
        prefill: {
          email: "vivek@gmail.com",
          contact: "7055029251",
          name: "Vivek Panwar",
        },
        theme: { color: "#fb8c00" },
      };

      RazorpayCheckout.open(options)
        .then((data) => {
          // handle success
          // Alert.alert(Success: ${data.razorpay_payment_id});
          console.log("Payment Successful");
          navigation.navigate('home');
          updateUserDetails();
          setLoading(false);
        })
        .catch((error) => {
          // handle failure
          setLoading(false);
          // Alert.alert(Error: ${error.code} | ${error.description});
          console.error(error);
        });
    } catch (error) {
      setLoading(false);
      console.error("Order creation failed:", error);
      // Alert.alert("Order creation failed", error.message);
    }
  };