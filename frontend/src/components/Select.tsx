import { Fragment, useRef } from 'react';
import { Listbox, Transition, Portal } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';

interface SelectProps<T> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}

export function Select<T>({ label, value, onChange, options, className }: SelectProps<T>) {
  const selectedOption = options.find(option => option.value === value);

  // Floating UI setup
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  return (
    <div className={clsx('w-full', className)}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </Listbox.Label>
          <Listbox.Button
            ref={node => {
              buttonRef.current = node;
              refs.setReference(node);
            }}
            className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-3 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-orange-500 text-base text-gray-500 dark:text-gray-400"
          >
            <span className="block truncate text-gray-700 dark:text-gray-300">{selectedOption?.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Portal>
              <Listbox.Options
                ref={refs.setFloating}
                style={{
                  ...floatingStyles,
                  width: buttonRef.current?.offsetWidth,
                  zIndex: 50,
                }}
                className="max-h-60 overflow-auto rounded-xl bg-gray-50 dark:bg-gray-800 py-1 text-base text-gray-700 dark:text-gray-300 shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none"
              >
                {options.map((option) => (
                  <Listbox.Option
                    key={String(option.value)}
                    className={({ active, selected }) =>
                      clsx(
                        'relative cursor-default select-none py-2 pl-10 pr-4 text-base',
                        active && 'bg-gray-100 dark:bg-gray-700',
                        selected ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'
                      )
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}>
                          {option.label}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Portal>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
} 