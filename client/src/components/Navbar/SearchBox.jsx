import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { LuHistory, LuTrendingUp } from "react-icons/lu";
import { getAutocompleteCache, setAutocompleteCache } from '../../utils/autocomplete';
import { getAutocomplete } from '../../redux/customer/autocomplete/action';
import { getHistory, saveHistory, deleteHistory } from '../../redux/customer/history/action';

const MAX_DISPLAY = 5;

function highlightMatch(text, query) {
    if (!query) return <span>{text}</span>;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <span>{text}</span>;
    return (
        <span>
            {text.slice(0, index)}
            <b>{text.slice(index, index + query.length)}</b>
            {text.slice(index + query.length)}
        </span>
    );
};

const SearchBox = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated } = useSelector((state) => state.auth);
    const { items: historyItems, loading: historyLoading } = useSelector((state) => state.history);
    const { items: autoItems, loading: autocompleteLoading } = useSelector((state) => state.autocomplete);

    const inputRef = useRef(null);
    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [suggestionMode, setSuggestionMode] = useState('history');
    const [cachedSuggestions, setCachedSuggestions] = useState(null);

    useEffect(() => {
        if (isAuthenticated) dispatch(getHistory());
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
        setSelectedIndex(-1);
    }, [input, showSuggestions, showAll]);

    const fetchAutocomplete = () => {
        const cached = getAutocompleteCache(input);
        if (cached) {
            setCachedSuggestions(cached);
            setShowSuggestions(true);
            // console.log("CACHED RETURNED ", input);
        } else {
            setCachedSuggestions(null);
            dispatch(getAutocomplete(input)).then((results) => {
                if (Array.isArray(results) && results.length) {
                    setAutocompleteCache(input, results);
                }
                setShowSuggestions(true);
            });
            // console.log("API CALL ", input);
        }
    };

    useEffect(() => {
        let timer;
        if (input && input.trim() !== '') {
            setSuggestionMode('autocomplete');
            timer = setTimeout(fetchAutocomplete, 400);
        } else {
            setCachedSuggestions(null);
            if (isAuthenticated && isFocused) {
                setSuggestionMode('history');
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        }
        return () => clearTimeout(timer);
    }, [input, isAuthenticated, isFocused, dispatch]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setShowAll(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onInputFocus = () => {
        setIsFocused(true);
        if (input.trim() === '') {
            if (isAuthenticated) {
                setSuggestionMode('history');
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        } else {
            setSuggestionMode('autocomplete');
            setShowSuggestions(true);
        }
    };

    const onInputChange = (e) => {
        setInput(e.target.value);
        setCachedSuggestions(null);
        setShowSuggestions(false);
    };

    const onSearchClick = () => {
        if (input.trim()) {
            if (isAuthenticated) dispatch(saveHistory(input.trim()));
            navigate(`/search?q=${encodeURIComponent(input.trim())}`);
            setIsFocused(false);
            setInput('');
        }
    };

    const onKeyDown = (e) => {
        if (showSuggestions && visibleSuggestions.length) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < visibleSuggestions.length - 1 ? prev + 1 : 0
                );
                return;
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : visibleSuggestions.length - 1
                );
                return;
            } else if (e.key === "Enter") {
                if (selectedIndex >= 0 && selectedIndex < visibleSuggestions.length) {
                    const selected = visibleSuggestions[selectedIndex];
                    onSuggestionClick(selected.phrase);
                    e.preventDefault();
                    return;
                }
            }
        }

        if (e.key === "Enter") {
            onSearchClick();
            e.preventDefault();
        }
    };

    const onShowMore = () => setShowAll(true);

    const onSuggestionClick = (text) => {
        setInput(text);
        if (isAuthenticated) dispatch(saveHistory(text));
        navigate(`/search?q=${encodeURIComponent(text)}`);
        setIsFocused(false);
        setInput('');
    };

    const onDeleteHistory = (id, e) => {
        e.stopPropagation();
        dispatch(deleteHistory(id));
    };

    let suggestions = [];
    if (showSuggestions) {
        if (suggestionMode === 'history' && isAuthenticated) {
            suggestions = historyItems || [];
        } else if (suggestionMode === 'autocomplete') {
            suggestions = cachedSuggestions || autoItems || [];
        }
    };

    const visibleSuggestions = showAll ? suggestions : suggestions.slice(0, MAX_DISPLAY);

    return (
        <div className='w-full' ref={inputRef}>
            <div className='flex items-center'>
                <input
                    className='w-full pl-4 pr-12 py-2 text-primary-900 bg-white border rounded-md focus:outline-none truncate'
                    value={input}
                    onChange={onInputChange}
                    onFocus={onInputFocus}
                    onKeyDown={onKeyDown}
                    placeholder="Search for fashion and more"
                    autoComplete="off"
                />
                <IoIosSearch
                    className='absolute md:top-1/2 right-6 md:right-4 transform md:-translate-y-1/2 text-primary-600 text-2xl cursor-pointer'
                    onClick={onSearchClick}
                />
            </div>

            {showSuggestions && visibleSuggestions.length > 0 && (
                <ul className='absolute top-full left-0 right-0 bg-white md:border border-primary-200 md:rounded-md md:mt-1 shadow-lg z-50'>
                    {visibleSuggestions.map((item, idx) => (
                        <li
                            key={idx}
                            className={`flex items-center justify-between px-4 py-2 cursor-pointer group ${selectedIndex === idx && 'bg-primary-100'}`}
                            onClick={() => onSuggestionClick(item.phrase)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                        >
                            <div className='flex items-center space-x-3'>
                                {suggestionMode === 'history' && isAuthenticated ?
                                    <LuHistory className="text-primary-500" /> :
                                    <LuTrendingUp className="text-primary-500" />
                                }
                                <span className='text-primary-700 overflow-hidden text-ellipsis whitespace-nowrap max-w-[280px]'>
                                    {highlightMatch(item.phrase, input)}
                                </span>
                            </div>
                            {suggestionMode === 'history' && isAuthenticated && (
                                <IoMdClose
                                    className='text-primary-500 rounded-md cursor-pointer'
                                    onClick={e => onDeleteHistory(item.id, e)}
                                />
                            )}
                        </li>
                    ))}
                    {!showAll && suggestions.length > MAX_DISPLAY && (
                        <li
                            className='py-2 flex justify-center text-primary-600 hover:text-primary-800 border-t border-primary-200 cursor-pointer'
                            onClick={onShowMore}
                        >
                            Show more...
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchBox;