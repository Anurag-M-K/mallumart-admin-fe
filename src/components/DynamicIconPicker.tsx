// DynamicIconPicker.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
// import { debounce } from './debounce';

// debounce.js
export const debounce = (func: (query: any) => Promise<void>, delay: number) => {
    let timeoutId: any;
    return (...args: [any]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};
const fetchIcons = async (query: string) => {
    const prefixes = 'mdi,fa';
    const url = new URL('https://api.iconify.design/search');
    url.searchParams.append('query', query);
    url.searchParams.append('prefixes', prefixes);
    url.searchParams.append('limit', '64');

    const response = await fetch(url);
    const data = await response.json();
    return data.icons;
};

const DynamicIconPicker = ({ onIconSelect, disabled, selectedIcon }: { onIconSelect: (icon: string) => void; disabled: boolean; selectedIcon: string }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [icons, setIcons] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled) {
            onIconSelect('');
        }
    }, [disabled]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedFetchIcons(query);
        setDropdownOpen(true);
    };

    const debouncedFetchIcons = useCallback(
        debounce(async (query) => {
            if (query) {
                const fetchedIcons = await fetchIcons(query);
                setIcons(fetchedIcons);
            } else {
                setIcons([]);
            }
        }, 300),
        []
    );

    const handleIconClick = (icon: string) => {
        onIconSelect(icon);
        setIcons([]);
        setSearchQuery('');
        setDropdownOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current?.contains(e.target as any)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <label htmlFor="disInput" className="text-sm font-bold">
                Choose a icon
            </label>
            <div className="flex items-center gap-2">
                <div className="relative w-full">
                    <input
                        id="iconSearchInput"
                        disabled={disabled}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search icons..."
                        className="form-input disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]"
                    />
                    {dropdownOpen && (
                        <div
                            ref={dropdownRef}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                zIndex: 1000,

                                maxHeight: '150px',
                                overflowY: 'auto',
                            }}
                            className="flex flex-wrap"
                        >
                            {icons.length > 0 ? (
                                icons.map((icon, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleIconClick(icon)}
                                        style={{
                                            padding: '10px',
                                            cursor: 'pointer',
                                        }}
                                        className="hover:bg-gray-50 flex items-center justify-center"
                                    >
                                        <Icon icon={icon} width="24" height="24" />
                                        {/* <span>{icon}</span> */}
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 text-xs">No results found</div>
                            )}
                        </div>
                    )}
                </div>
                {selectedIcon ? (
                    <Icon icon={selectedIcon} width="24" height="24" style={{ marginRight: '10px' }} />
                ) : (
                    <Icon icon="mingcute:border-blank-line" width="24" height="24" style={{ marginRight: '10px' }} />
                )}
            </div>
        </div>
    );
};

export default DynamicIconPicker;
