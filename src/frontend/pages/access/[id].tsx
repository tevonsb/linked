import LitJsSdk from 'lit-js-sdk';
import { useState } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

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
  const linkMutation = useMutation(mutator, {
    onSuccess: (data) => {
      console.log(data);
      if (data.data.link) {
        window.location.href = `https://${data.data.link}`;
      }
    },
  });

  const router = useRouter();
  const { id } = router.query;

  const onSubmit = async () => {
    const client = new LitJsSdk.LitNodeClient();
    await client.connect();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: `ethereum`,
    });
    console.log(authSig);
    console.log(router.pathname);
    linkMutation.mutate({
      url: `/access`,
      update: { authSig, id },
    });
  };
  return (
    <>
      <button
        type="button"
        onClick={onSubmit}
        className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Access liNK
      </button>
    </>
  );
}
