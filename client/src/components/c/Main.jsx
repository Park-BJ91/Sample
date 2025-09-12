import List from './List.jsx';
import Row from './Row.js';
import { products } from '@root/data.js';
import '../../App.css';


export default function App() {
    return (
        <List
            items={products}
            renderItem={(product, isHighlighted) =>
                <Row
                    key={product.id}
                    title={product.title}
                    isHighlighted={isHighlighted}
                />
            }
        />
    );
}
