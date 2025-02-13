import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/Board.css';
import BoardRow from './BoardRow';
import Pagination from '../../components/Pagination';
import { PORT_NUMBER, API_URL } from '../../utils/constant';
/**
 *
 * @description Board 페이지 컴포넌트
 */
const Board = () => {
    const [inputData, setInputData] = useState([]);
    const pageName = 'Board';
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(
                `${API_URL}${PORT_NUMBER}/Board/?srchType=&srchKeyword=&page=1`,
            );
            setInputData(response.data.boardDtoList);
            setSearchHelper(response.data.searchHelper);
        };
        fetchData();
    }, []);

    /**
     * @description 페이지네이션 기능
     *
     */
    const [searchHelper, setSearchHelper] = useState([]);

    const handleButton = async (e, param) => {
        e.preventDefault();
        const response = await axios.get(
            `${API_URL}${PORT_NUMBER}/Board/?page=${param}`,
        );
        setSearchHelper(response.data.searchHelper);
        setInputData(response.data.boardDtoList);
    };

    /**
     *
     * @description 검색 쿼리 기능
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const select = document.forms['searchBar']['srchType'].value;
        const search = document.forms['searchBar']['srchKeyword'].value;
        if (search === '') {
            alert('검색어를 입력해주세요!');
            navigate(`/Board`);
        } else {
            const response = await axios.get(
                `${API_URL}${PORT_NUMBER}/Board/?srchType=${select}&srchKeyword=${search}`,
            );
            setInputData(response.data.boardDtoList);
        }
    };

    return (
        <>
            <main>
                <div className="Board ">
                    <div className="Board__header">
                        <p className="minititle">정보공유 게시판</p>
                    </div>
                    <div className="Board__navbar">
                        <div>전체 {searchHelper.totalRowCnt}건</div>
                        <form
                            className="Board__search"
                            name="searchBar"
                            onSubmit={handleSubmit}
                        >
                            <select name="srchType" id="srchType">
                                <option value="title">제목</option>
                                <option value="content">내용</option>
                                <option value="writer">작성자</option>
                            </select>
                            <input
                                type="text"
                                placeholder="검색어를 입력하세요"
                                name="srchKeyword"
                                id="srchKeyword"
                            ></input>
                            <input
                                type="submit"
                                className="Board__search--button"
                                id="submit"
                                name="submit"
                                value="검 색"
                            ></input>
                        </form>
                    </div>
                    <div className="Board__content--title">
                        <div className="Board__content--number">번호</div>
                        <div className="Board__content--name">제목</div>
                        <div className="Board__content--writer">작성자</div>
                        <div className="Board__content--date">날짜</div>
                        <div className="Board__content--hits">조회수</div>
                    </div>
                    {inputData.map((inputData) => {
                        return (
                            <BoardRow
                                Board={inputData}
                                key={inputData.brdKey}
                            />
                        );
                    })}
                    <div className="Board__footer">
                        <Link to="PostBoard" className="Board__footer--button">
                            글쓰기
                        </Link>
                    </div>
                    <div className="Board__page">
                        <Pagination
                            searchHelper={searchHelper}
                            pageName={pageName}
                            handleButton={handleButton}
                        />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Board;
