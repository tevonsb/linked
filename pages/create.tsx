import LitJsSdk from 'lit-js-sdk';
import { useState } from 'react';

const baseCondition = {
  contractAddress: ``,
  standardContractType: ``,
  chain: `ethereum`,
  method: `eth_getBalance`,
  parameters: [`:userAddress`, `latest`],
  returnValueTest: {
    comparator: `>=`,
    value: `10000000000000`,
  },
};

export default function Create() {
  const [link, setLink] = useState(``);

  const getAccessControlConditions = () => {
    return [baseCondition];
  };

  const onSubmit = async () => {
    const client = new LitJsSdk.LitNodeClient();
    await client.connect();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: `ethereum`,
    });
    console.log(authSig);

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      link,
    );
    console.log(encryptedString);
    console.log(symmetricKey);

    const accessControlConditions = getAccessControlConditions();
    const encryptedSymmetricKey = await client.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: `ethereum`,
    });
    console.log(encryptedSymmetricKey);
  };

  return (
    <>
      <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Create a new link
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Link to protect
                </label>
                <div className="flex mt-1">
                  <span className="inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 sm:text-sm">
                    https://
                  </span>
                  <input
                    id="link"
                    name="link"
                    onChange={(e) => setLink(e.target.value)}
                    type="url"
                    required
                    className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 shadow-sm appearance-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  ETH balance needed
                </label>
                <div className="mt-1">
                  <input
                    id="balance"
                    name="balance"
                    type="number"
                    required
                    className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onSubmit}
                >
                  Create link
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
