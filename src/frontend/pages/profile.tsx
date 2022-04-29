import { Fragment, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MenuAlt2Icon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline';
import LinkList from '../components/LinkList';
import axios from 'axios';
import { useQuery } from 'react-query';

const navigation = [
  { name: `Dashboard`, href: `#`, icon: HomeIcon, current: true },
];
const userNavigation = [
  { name: `Your Profile`, href: `#` },
  { name: `Settings`, href: `#` },
  { name: `Sign out`, href: `#` },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(` `);
}

const fetcher = async (context) => {
  const res = await axios.get(`/api/${context.queryKey[0]}`);
  if (res.status !== 200) {
    throw new Error(res.statusText);
  }
  return res.data;
};

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log(`BEfore query`);
  const {
    data: links,
    isLoading,
    error,
    isFetching,
  } = useQuery(`link`, fetcher);

  console.log(links);
  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-40 flex md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-indigo-700">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 pt-2 -mr-12">
                    <button
                      type="button"
                      className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="w-6 h-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 mt-5 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? `bg-indigo-800 text-white`
                            : `text-indigo-100 hover:bg-indigo-600`,
                          `group flex items-center px-2 py-2 text-base font-medium rounded-md`,
                        )}
                      >
                        <item.icon
                          className="flex-shrink-0 w-6 h-6 mr-4 text-indigo-300"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-indigo-700">
            <div className="flex items-center flex-shrink-0 px-4">
              <img
                className="w-auto h-8"
                src="https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg"
                alt="Workflow"
              />
            </div>
            <div className="flex flex-col flex-1 mt-5">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? `bg-indigo-800 text-white`
                        : `text-indigo-100 hover:bg-indigo-600`,
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md`,
                    )}
                  >
                    <item.icon
                      className="flex-shrink-0 w-6 h-6 mr-3 text-indigo-300"
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 md:pl-64">
          <main>
            <div className="py-6">
              <div className="px-4 mx-auto sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Links</h1>
              </div>
            </div>
            <LinkList links={links} />
          </main>
        </div>
      </div>
    </>
  );
}
