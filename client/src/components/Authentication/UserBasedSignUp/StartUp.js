import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StartUp = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
    gstNumber: "",
    cinNumber: "",
    panNumber: "",
    incubator_address: "",
    startup_domain: "",
    startup_owner: "",
    investor_amount: 0,
  });

  const handleCredentials = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleUploadPicture = async (e) => {
    setLoading(true);

    // If no image selected
    if (e.target.files[0] === undefined) {
      return toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "left-accent",
      });
    }

    // Check if the type of image is jpeg or png
    if (
      e.target.files[0].type === "image/jpeg" ||
      e.target.files[0].type === "image/png"
    ) {
      try {
        const data = new FormData();
        data.append("file", e.target.files[0]); // Contains the file
        data.append("upload_preset", "chat-app"); // Upload preset in Cloudinary
        data.append("cloud_name", "devcvus7v"); // Cloud name in Cloudinary

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/devcvus7v/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const json = await response.json();

        setCredentials({
          ...credentials,
          [e.target.name]: json.secure_url.toString(),
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      console.log("Hello");
      setLoading(false);
      return toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "left-accent",
      });
    }
  };

  const submitHandler = async () => {
    setLoading(true);

    // If anything is missing
    if (
      !credentials.name ||
      !credentials.email ||
      !credentials.password ||
      !credentials.confirmPassword
    ) {
      setLoading(false);
      return toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "left-accent",
      });
    }

    // If password and confirm password doesn't match
    if (credentials.password !== credentials.confirmPassword) {
      setLoading(false);
      return toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "left-accent",
      });
    }

    // Now submit the data
    try {
      const response = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          pic: credentials.pic,
          userType: "startUp",
          gstNumber: credentials.gstNumber,
          cinNumber: credentials.cinNumber,
          panNumber: credentials.panNumber,
          incubator_address: credentials.incubator_address,
          startup_domain: credentials.startup_domain,
          startup_owner: credentials.startup_owner,
          investor_amount: credentials.investor_amount,
        }),
      });
      const data = await response.json();

      toast({
        title: data.message,
        status: !data.success ? "error" : "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: !data.success ? "left-accent" : "solid",
      });

      if (data.success) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/startup/dashboard");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      return toast({
        title: "Internal server error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    }
  };

  return (
    <Stack spacing="6">
      <Stack spacing="5">
        <FormControl isRequired id="name">
          <FormLabel htmlFor="name" color="white">
            Name
          </FormLabel>
          <Input
            background="white"
            type="text"
            name="name"
            value={credentials.name}
            placeholder="Enter Your StartUp Name"
            onChange={(e) => handleCredentials(e)}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="email">
          <FormLabel htmlFor="email" color="white">
            Email
          </FormLabel>
          <Input
            background="white"
            type="email"
            name="email"
            value={credentials.email}
            placeholder="Enter Your Email"
            onChange={(e) => handleCredentials(e)}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="gstNumber">
          <FormLabel htmlFor="gstNumber" color="white">
            GST Number
          </FormLabel>
          <Input
            background="white"
            type="text"
            name="gstNumber"
            value={credentials.gstNumber}
            placeholder="Enter Your GST Number"
            onChange={(e) => handleCredentials(e)}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="panNumber">
          <FormLabel htmlFor="panNumber" color="white">
            PAN Number
          </FormLabel>
          <Input
            background="white"
            type="text"
            name="panNumber"
            value={credentials.panNumber}
            placeholder="Enter Your PAN Number"
            onChange={(e) => handleCredentials(e)}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl id="cinNumber">
          <FormLabel htmlFor="cinNumber" color="white">
            CIN Number
          </FormLabel>
          <Input
            background="white"
            type="text"
            name="cinNumber"
            value={credentials.cinNumber}
            placeholder="Enter Your CIN Number"
            onChange={(e) => handleCredentials(e)}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="startup_domain">
          <FormLabel htmlFor="startup_domain" color="white">
            Domain
          </FormLabel>
          <Input
            background="white"
            type="text"
            name="startup_domain"
            value={credentials.startup_domain}
            placeholder="Enter Your Domain (Eg : Finance,Tech)"
            onChange={(e) => handleCredentials(e)}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="startup_owner">
          <FormLabel htmlFor="startup_owner" color="white">
            Owner Name
          </FormLabel>
          <Input
            background="white"
            type="text"
            name="startup_owner"
            value={credentials.startup_owner}
            placeholder="Enter the owner name"
            onChange={(e) => handleCredentials(e)}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="password">
          <FormLabel htmlFor="password" color="white">
            Password
          </FormLabel>
          <InputGroup background="white">
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
            <Input
              type={show ? "text" : "password"}
              name="password"
              value={credentials.password}
              placeholder="Password"
              onChange={(e) => handleCredentials(e)}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired id="confirmPassword">
          <FormLabel htmlFor="confirmPassword" color="white">
            Confirm Password
          </FormLabel>
          <InputGroup background="white">
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
            <Input
              type={show ? "text" : "password"}
              name="confirmPassword"
              value={credentials.confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => handleCredentials(e)}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl id="pic">
          <FormLabel htmlFor="pic" color="white">
            Upload your Logo
          </FormLabel>

          <InputGroup background="white">
            <InputLeftElement pointerEvents="none">
              <i className="fas fa-folder-open" />
            </InputLeftElement>

            <Input
              type="file"
              name="pic"
              accept="image/*"
              isInvalid={true}
              errorBorderColor="#eaafc8"
              sx={{
                "::file-selector-button": {
                  height: 10,
                  padding: 0,
                  mr: 4,
                  background: "none",
                  border: "none",
                  fontWeight: "bold",
                },
              }}
              onChange={(e) => handleUploadPicture(e)}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => submitHandler()}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </Stack>
  );
};

export default StartUp;