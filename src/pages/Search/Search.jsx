import React, { useContext, useState } from "react";
import { DataContext } from "../../contexts/DataContexts";
import UserCard from "../../components/common/UserCard";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const { userData } = useContext(DataContext);

  const searcDataArr = userData?.filter((item) =>
    item.fullName.toLocaleLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="py-8 px-20 h-[100%] w-full flex items-center justify-center">
      <div className="w-[45%] h-full rounded-md">
        <div
          className={`flex w-full`}
        >
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            className=" px-5 py-2 w-full mb-2  rounded-3xl focus:outline-0 bg-white shadow-sm"
            type="text"
            placeholder="Search by Name"
          />
        </div>
        <div className="overflow-y-scroll mt-2" style={{scrollbarWidth: 'none'}}>
          {searchValue !== "" &&
            searcDataArr.length > 0 &&
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
