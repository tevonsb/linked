import LitJsSdk from 'lit-js-sdk';
import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';

import { Dialog, Transition } from '@headlessui/react';

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

const fetcher = async (url) => {
  const res = await axios.get(`/api/${url}`);

  if (res.status !== 200) {
    throw new Error(res.statusText);
  }
  return res.data;
};

const mutator = async (key: { url: string; update: any }) => {
  const { url, update } = key;
  return axios.post(`/api/${url}`, update);
};

export default function Create() {
  const [link, setLink] = useState(``);
  const [encryptedLink, setEncryptedLink] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const linkMutation = useMutation(mutator, {
    onSuccess: (data) => {
      console.log(data);
      setEncryptedLink(`https://localhost:3000/access/${data.data.id}`);
    },
  });

  useEffect(() => {
    if (encryptedLink) {
      setModalOpen(true);
    }
  }, [encryptedLink]);

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

    // Convert blob content to hex to store in database
    const blobArray = await new Response(encryptedString).arrayBuffer();
    const hexBlob = Buffer.from(blobArray).toString(`hex`);

    const accessControlConditions = getAccessControlConditions();
    const encryptedSymmetricKey: Uint8Array = await client.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: `ethereum`,
    });
    linkMutation.mutate({
      url: `/link`,
      update: {
        authSig,
        encryptedLink: hexBlob,
        encryptedKey: LitJsSdk.uint8arrayToString(
          encryptedSymmetricKey,
          `base16`,
        ),
        condition: accessControlConditions,
      },
    });
  };

  return (
    <>
      <LinkModal
        open={modalOpen}
        setOpen={() => setModalOpen(false)}
        link={encryptedLink}
      />
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

const LinkModal: React.FC = (props: any) => {
  const { open, setOpen, link } = props;
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full"></div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Your link is ready
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{link}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Copy and close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
