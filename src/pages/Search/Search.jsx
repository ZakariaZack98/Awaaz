import React, { useContext, useState } from "react";
import { DataContext } from "../../contexts/DataContexts";
import UserCard from "../../components/common/UserCard";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const { userData, setUserData } = useContext(DataContext);
  console.log("Form search", userData);

  const searcDataArr = userData?.filter((item) =>
    item.fullName.toLocaleLowerCase().startsWith(searchValue.toLowerCase())
  );
  console.log(searcDataArr);

  return (
    <div className="py-10 px-20 h-[90%]">
      <h1 className="text-4xl font-bold mb-5">Search</h1>
      <div className="w-[50%] h-full">
        <div className="flex w-full">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            className=" p-2 rounded border-[2px] w-full mb-2 bg-gray-200 border-gray-300"
            type="text"
            placeholder="Search by Name"
          />
        </div>
        <div className="h-[90%] overflow-y-scroll">
          {searchValue !== "" &&
            searcDataArr &&
            searcDataArr.map((singleSearchData) => (
              <div className="mr-2">
                <UserCard
                  key={singleSearchData.userId}
                  singleUserData={singleSearchData}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
