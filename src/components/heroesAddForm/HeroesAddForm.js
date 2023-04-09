import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { useHttp } from '../../hooks/http.hook';
import { heroAdded } from '../../actions';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState("");
    const [heroDescr, setheroDescr] = useState("");
    const [heroElem, setHeroElem] = useState("");

    const {filters, filtersLoadingStatus} = useSelector(state => state.filtersReducer);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if( !heroName || !heroDescr || !heroElem) {
            alert ('Не все поля заполнены!');
            return;
        }

        const newHero = {
            "id": uuidv4(),
            "name": heroName,
            "description": heroDescr,
            "element": heroElem
        };

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(res => console.log(res, 'Added'))
            .then(dispatch(heroAdded(newHero)))
            .catch((err) => console.log('Posting error', err));

        setHeroName('');
        setheroDescr('');
        setHeroElem('');
    };

    const renderFilters = (filters, filterStatus) => {
        if (filterStatus === 'loading') {
            return <option>загрузка элементов</option>
        } else if (filterStatus === 'error') {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0) {
            
            return filters.map(({name, label}) => {
                // eslint-disable-next-line
                if (name === 'all') return;
                
                return <option key={name} value={name}>{label}</option>
            })
        }

    }

    return (
        <form className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">
                    Имя нового героя
                </label>
                <input
                    required
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Как меня зовут?"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">
                    Описание
                </label>
                <textarea
                    required
                    value={heroDescr}
                    onChange={(e) => setheroDescr(e.target.value)}
                    name="text"
                    className="form-control"
                    id="text"
                    placeholder="Что я умею?"
                    style={{ height: "130px" }}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">
                    Выбрать элемент героя
                </label>
                <select
                    required
                    value={heroElem}
                    onChange={(e) => setHeroElem(e.target.value)}
                    className="form-select"
                    id="element"
                    name="element"
                >
                    <option>Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button
                onClick={(e) => onSubmitHandler(e)}
                type="submit"
                className="btn btn-primary"
            >
                Создать
            </button>
        </form>
    );
};

export default HeroesAddForm;
