import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

//Components
import BasePageContainer from "../layout/PageContainer";
import Loader from "../loader";
import { webRoutes } from "../../routes/web";
import {
  getSpecificUser,
  editUserDetail,
  uploadImage,
} from "../../redux/methods/userMethods";

const breadcrumb = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.users,
      title: <Link to={webRoutes.users}>Users</Link>,
    },
    {
      key: webRoutes.userDetail,
      title: <Link to={webRoutes.userDetail}>User Detail</Link>,
    },
  ],
};

export default function UserDetail() {
  const [userDetail, setUserDetail] = useState({});
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);

  const { id } = useParams();
  const fileInput = useRef();
  const dispatch = useDispatch();
  const { loading, user, errors } = useSelector(
    (state) => state.getSpecificUserReducer
  );
  const { errors: editErrors } = useSelector(
    (state) => state.editProfileReducer
  );
  const { imageURL, loading: imageLoading } = useSelector(
    (state) => state.uploadImageReducer
  );

  //Display Errors
  useEffect(() => {
    if (errors.length > 0) {
      errors.map((err) => {
        if (err.response) {
          return toast.error(err.response.data.msg);
        } else {
          return toast.error(err.message);
        }
      });
    }
  }, [errors]);

  //Display Errors
  useEffect(() => {
    if (editErrors.length > 0) {
      editErrors.map((err) => toast.error(err.message));
    }
  }, [editErrors]);

  //Get Specific User
  useEffect(() => {
    dispatch(getSpecificUser(id));
  }, [dispatch, id]);

  //Store User Detail
  useEffect(() => {
    if (user) {
      setUserDetail(user[0]);
    }
  }, [user]);

  //Upload Image
  useEffect(() => {
    if (imageURL) {
      //Update Profile
      setUserDetail({ ...userDetail, profile_image: imageURL });
      dispatch(editUserDetail(userDetail));
    }
  }, [imageURL, dispatch, userDetail]);

  //Functions
  const handleEdit = (e) => {
    e.preventDefault();

    setEditProfileLoading(true);
    dispatch(editUserDetail(userDetail));
    setEditProfileLoading(false);
  };

  const handleDeleteImage = (e) => {
    e.preventDefault();
    setDeleteImageLoading(true);
    setUserDetail({ ...userDetail, profile_image: "" });

    dispatch(editUserDetail(userDetail));
    setDeleteImageLoading(false);
  };

  const handleUploadImage = (e) => {
    e.preventDefault();

    const files = fileInput.current.files;
    if (files.length === 0) return;

    const file = files[0];
    const filePath = `public/${file.name}-${Date.now()}`;

    dispatch(uploadImage(filePath, file));
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      {!loading ? (
        <>
          <div className="mx-5 mt-5">
            <article>
              <header className="space-y-1">
                <h1 className="font-display font-poppins font-medium text-3xl tracking-tight text-slate-900">
                  User Detail
                </h1>
              </header>
            </article>
          </div>
          <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4">
            <div className="col-span-full xl:col-auto">
              <div className="p-4 mb-4 bg-gray-200 border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2">
                <div className="sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                  {userDetail?.profile_image ? (
                    <img
                      className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
                      src={userDetail?.profile_image}
                      alt={userDetail?.name}
                    />
                  ) : (
                    <Avatar shape="square" size="large">
                      {userDetail?.name}
                    </Avatar>
                  )}
                  <div>
                    <h3 className="mb-1 text-xl font-bold font-poppins text-gray-900">
                      Profile picture
                    </h3>
                    <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                      JPG, GIF or PNG. Max size of 800K
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInput}
                        style={{ display: "none" }}
                        onChange={handleUploadImage}
                      />
                      <Button
                        className="bg-black font-poppins text-white"
                        size="large"
                        loading={imageLoading}
                        onClick={() =>
                          fileInput.current && fileInput.current.click()
                        }
                      >
                        Upload
                      </Button>
                      <Button
                        className="bg-red-600 text-white font-poppins"
                        size="large"
                        loading={deleteImageLoading}
                        onClick={handleDeleteImage}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 mb-4 bg-gray-200 border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2">
                <div className="sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                  <div>
                    <h3 className="mb-1 text-xl font-bold font-poppins text-gray-900">
                      Number of Requests
                    </h3>
                    <div className="mb-4 text-lg font-poppins font-medium">
                      50000
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 mb-4 bg-gray-200 border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2">
                <h3 className="mb-1 text-xl font-bold font-poppins text-gray-900">
                  Team Members
                </h3>
                <div
                  className="mb-4 2xl:col-span-2 scroll-container"
                  style={{
                    overflowY: "auto",
                    maxHeight: "calc(60vh - 200px)",
                  }}
                >
                  <div className="sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                    <div>
                      <ul className="list-style-type:none;">
                        <li>
                          <p className="text-lg font-poppins font-bold">
                            Huzaifa Shah
                          </p>
                          <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                            huzaifa@cti.com
                          </p>
                        </li>
                        <li>
                          <p className="text-lg font-poppins font-bold">
                            Huzaifa Shah
                          </p>
                          <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                            huzaifa@cti.com
                          </p>
                        </li>{" "}
                        <li>
                          <p className="text-lg font-poppins font-bold">
                            Huzaifa Shah
                          </p>
                          <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                            huzaifa@cti.com
                          </p>
                        </li>{" "}
                        <li>
                          <p className="text-lg font-poppins font-bold">
                            Huzaifa Shah
                          </p>
                          <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                            huzaifa@cti.com
                          </p>
                        </li>{" "}
                        <li>
                          <p className="text-lg font-poppins font-bold">
                            Huzaifa Shah
                          </p>
                          <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                            huzaifa@cti.com
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="p-4 mb-4 bg-gray-200 border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2">
                <h3 className="mb-4 text-xl font-semibold font-poppins">
                  General information
                </h3>
                <form action="#">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <p className="block text-sm font-medium font-poppins text-gray-900">
                        Fullname
                      </p>
                      <Input
                        className="bg-gray-50 font-lato text-gray-900 sm:text-sm py-1.5 w-50"
                        placeholder="Enter your name"
                        value={userDetail?.name}
                        onChange={(e) =>
                          setUserDetail({ ...userDetail, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <p className="block text-sm font-medium font-poppins text-gray-900">
                        Email
                      </p>
                      <Input
                        className="bg-gray-50 font-lato text-gray-900 sm:text-sm py-1.5 w-50"
                        placeholder="Enter your Email"
                        value={userDetail?.email}
                        readOnly
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <p className="block text-sm font-medium font-poppins text-gray-900">
                        Phone Number
                      </p>
                      <Input
                        className="bg-gray-50 font-lato text-gray-900 sm:text-sm py-1.5 w-50"
                        placeholder="Enter your Phone Number"
                        value={userDetail?.phone_number}
                        onChange={(e) =>
                          setUserDetail({
                            ...userDetail,
                            phone_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <p className="block text-sm font-medium font-poppins text-gray-900">
                        Role
                      </p>
                      <Input
                        className="bg-gray-50 font-lato text-gray-900 sm:text-sm py-1.5 w-50"
                        placeholder="Role"
                        value={userDetail?.role}
                        readOnly
                      />
                    </div>
                    <div className="col-span-6 sm:col-full">
                      <Button
                        className="mt-4 bg-black"
                        type="primary"
                        size="large"
                        loading={editProfileLoading}
                        onClick={handleEdit}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
                <div className="w-full md:w-1/3 p-4 mb-4 md:mb-0 bg-gray-200 border border-gray-200 rounded-lg shadow-sm max-h-48">
                  <h3 className="mb-1 text-xl font-bold font-poppins text-gray-900">
                    Your Current Plan
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="font-poppins font-bold text-xl">Freemium</p>
                    <p className="font-poppins font-bold text-lg">Free</p>
                  </div>
                  <p className="font-poppins font-bold text-lg">
                    1
                    <span className="font-poppins font-medium text-gray-500 text-sm">
                      {" "}
                      User
                    </span>
                  </p>
                  <p className="font-poppins font-bold text-lg">
                    1
                    <span className="font-poppins font-medium text-gray-500 text-sm">
                      {" "}
                      API
                    </span>
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="font-poppins font-bold text-lg">
                      500
                      <span className="font-poppins font-medium text-gray-500 text-sm">
                        {" "}
                        Requests/mo
                      </span>
                    </p>
                    <p className="font-poppins font-bold text-lg">
                      Current Plan
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-2/3 p-4 bg-gray-200 border border-gray-200 rounded-lg shadow-sm">
                  <h3 className="mb-1 text-xl font-bold font-poppins text-gray-900">
                    History
                  </h3>
                  <div
                    className="2xl:col-span-2 scroll-container"
                    style={{
                      overflowY: "auto",
                      maxHeight: "calc(60vh - 200px)",
                    }}
                  >
                    <div>
                      <ul className="list-style-type:none">
                        <li>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-poppins font-bold">
                                Basic Plan
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                19 April, 12:00
                              </p>
                            </div>
                            <div className="mr-4">
                              <p className="text-lg font-poppins font-bold">
                                $199
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                Card 0123
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-poppins font-bold">
                                Basic Plan
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                19 April, 12:00
                              </p>
                            </div>
                            <div className="mr-4">
                              <p className="text-lg font-poppins font-bold">
                                $199
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                Card 0123
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-poppins font-bold">
                                Basic Plan
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                19 April, 12:00
                              </p>
                            </div>
                            <div className="mr-4">
                              <p className="text-lg font-poppins font-bold">
                                $199
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                Card 0123
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-poppins font-bold">
                                Basic Plan
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                19 April, 12:00
                              </p>
                            </div>
                            <div className="mr-4">
                              <p className="text-lg font-poppins font-bold">
                                $199
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                Card 0123
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-poppins font-bold">
                                Basic Plan
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                19 April, 12:00
                              </p>
                            </div>
                            <div className="mr-4">
                              <p className="text-lg font-poppins font-bold">
                                $199
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                Card 0123
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-poppins font-bold">
                                Basic Plan
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                19 April, 12:00
                              </p>
                            </div>
                            <div className="mr-4">
                              <p className="text-lg font-poppins font-bold">
                                $199
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                Card 0123
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-poppins font-bold">
                                Basic Plan
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                19 April, 12:00
                              </p>
                            </div>
                            <div className="mr-4">
                              <p className="text-lg font-poppins font-bold">
                                $199
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                Card 0123
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-poppins font-bold">
                                Basic Plan
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                19 April, 12:00
                              </p>
                            </div>
                            <div className="mr-4">
                              <p className="text-lg font-poppins font-bold">
                                $199
                              </p>
                              <p className="mb-4 font-poppins font-medium text-gray-500 text-sm">
                                Card 0123
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </BasePageContainer>
  );
}
