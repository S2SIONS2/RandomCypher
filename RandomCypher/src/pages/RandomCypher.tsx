import React, { useEffect, useState } from 'react';
import './RandomCypher.scss';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RandomCypher = () => {
    // 로딩 상태
    const [isLoading, setIsLoading] = useState(true);

    // API에서 받은 캐릭터 리스트
    const [list, setList] = useState<characterInfo[]>([]);
    type characterInfo = {
        characterId: string,
        characterName: string
    };

    // 캐릭터 API 호출
    const getApi = async () => {
        try {
            const apiKey = import.meta.env.VITE_CHARACTERS_API_ID;
            const response = await axios.get(`/characters?apikey=${apiKey}`, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            console.log('API Response:', response); // 응답 데이터 확인
            // console.log(apiKey)
            if (response.status === 200) {
                const characterList = response.data.rows.map((item: characterInfo) => ({
                    characterId: item.characterId,
                    characterName: item.characterName
                }));
                console.log('Character List:', characterList); // 리스트 데이터 확인
                setList(characterList);
            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    // 인원 수와 랜덤 캐릭터 배열 상태
    const [count, setCount] = useState<string>(localStorage.getItem('인원') || '1');
    const [randomValues, setRandomValues] = useState<characterInfo[]>([]);

    // 인원 수 변경 핸들러 (숫자 입력만 허용)
    const countHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        // 숫자만 허용하고 빈 문자열도 허용
        if (/^\d*$/.test(newValue)) {
            setCount(newValue);
            localStorage.setItem('인원', newValue || '1'); // 비어 있을 경우 '1'로 설정
        }
    };

    // 숫자 증감 버튼 조작 핸들러
    const updateCount = (increment: boolean) => {
        let newCount = Number(count) + (increment ? 1 : -1);
        newCount = Math.min(Math.max(newCount, 1), 5); // 1~5 범위로 제한
        setCount(newCount.toString());
        localStorage.setItem('인원', newCount.toString());
    };

    // 이름 배열 상태
    const [names, setNames] = useState<string[]>(() => {
        // 초기 로컬 스토리지 값 불러오기
        const storedNames = Array(5)
            .fill('')
            .map((_, index) => localStorage.getItem(`name${index + 1}`) || '');
        return storedNames;
    });

    // 이름 변경 핸들러
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        setNames((prevNames) => {
            const updatedNames = [...prevNames];
            updatedNames[index] = value;
            // 로컬 스토리지에 업데이트
            localStorage.setItem(`name${index + 1}`, value);
            return updatedNames;
        });
    };

    // 리스트 새로 뽑기
    const rendering = () => {
        if (list.length > 0) {
            const newRandomValues: characterInfo[] = [];
            while (newRandomValues.length < Number(count)) {
                const randomIndex = Math.floor(Math.random() * list.length);
                const selectedItem = list[randomIndex];

                // 중복 방지
                if (!newRandomValues.some(item => item.characterId === selectedItem.characterId)) {
                    newRandomValues.push(selectedItem);
                }
            }
            setRandomValues(newRandomValues);
        }
    }

    
    // 복사하기 버튼 클릭 핸들러
    const handleCopy = () => {
        navigator.clipboard.writeText(randomValues.map(item => item.characterName).join(', '));
        toast.success('복사가 완료되었습니다!');
    };
    
    // 랜덤 캐릭터 값 생성
    useEffect(() => {
        rendering()
    }, [count, list]);

    // API 호출
    useEffect(() => {
        getApi();
        console.log(list)
        console.log(randomValues)
    }, []);
    

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className='RandomCypher p-2 row flex-column'>
            {/* 인원 수 입력 및 버튼 */}
            <section className='m-0 p-0 g-0'>
                <div className='row align-items-center justify-content-between gap-1 w-100 p-0 g-0 m-0 mb-2'>
                    <input
                        type='text' // 숫자처럼 동작하지만 문자열로 관리
                        value={count}
                        onChange={countHandle}
                        className='w-50 flex-grow-1 display-6 text-center'
                    />
                    <button className='w-auto p-2' onClick={() => updateCount(false)}>-</button>
                    <button className='w-auto p-2' onClick={() => updateCount(true)}>+</button>
                </div>

                <div className='row align-items-center justify-content-end p-0 g-0 m-0 mb-2'>
                    <button
                        type='button'
                        className='w-auto p-2 me-2'
                        onClick={rendering}
                    >
                        뽑기
                    </button>
                    <button
                        type='button'
                        className='w-auto p-2'
                        onClick={handleCopy}
                    >
                        캐릭터 복사하기
                    </button>
                </div>
            </section>
            <section  className='m-0 p-0 g-0'>
                {/* 캐릭터 리스트 및 이름 입력 */}
                <div className='row justify-content-between p-2 g-0 m-0 list h-100'>
                    {/* 캐릭터 이미지 및 이름 */}
                    <div className='w-50 m-0 p-0 g-0'>
                        {randomValues.map((item) => (
                            <div key={item.characterId} className='row m-0 p-0 g-0 mb-2 align-items-center'>
                                <div className='w-auto m-0 p-0 g-0 me-2'>
                                    <img
                                        src={`https://img-api.neople.co.kr/cy/characters/${item.characterId}?zoom=2`}
                                        alt="캐릭터 이미지"
                                    />
                                </div>
                                <div className='w-auto m-0 p-0 g-0'>
                                    <h2>{item.characterName}</h2>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 이름 입력 */}
                    <div className='w-50 m-0 p-0 g-0'>
                        {randomValues.map((_, index) => (
                            <div className='row m-0 p-0 g-0 mb-2 align-items-center' key={index}>
                                <input
                                    type="text"
                                    value={names[index]}
                                    onChange={(e) => handleNameChange(e, index)}
                                    placeholder={`name${index + 1}`}
                                    className='form-control'
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 토스트 알림 */}
                <ToastContainer position="top-center" autoClose={2000} />
            </section>
        </div>
    );
}

export default RandomCypher;
