import Layout from "@/components/layout";
import {useEffect, useState} from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';



function Categories({swal}) {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [properties, setProperties] = useState([]);
    useEffect(() => {

        fetchCategories()

    }, [])
    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {name, parentCategory, properties:properties.map(p => ({name:p.name,values:p.values.split(',')})),};
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null)

        } else {
            await axios.post('/api/categories', data);

        }
        setName('');
        setParentCategory('')
        setProperties([])
        fetchCategories();
    }
    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({name,values}) => ({
            name,
            values:values.join(',')
        }))
    );

    }
    function deleteCategory(category){
        swal.fire({
            title: 'Are you Sure',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: 'Cancel',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#d55',
            reverseButtons: true,

        }).then( async result => {
            if (result.isConfirmed){
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }

        })
    }
    function addProperty() {
        setProperties(prev => {
            return [...prev, {name:'', values:''}]
        })
    }
    function handlePropertyNameChange(index, property, newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })

    }

    function handlePropertyValueChange(index, property, newValue){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValue;
            return properties;

        })

    }
    function removeProperty(indexToRemove){
        setProperties(prev => {
            const newProperties = [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove;
            });
            return newProperties;

        });
    }
    return(
        <Layout>
            <h1> Categories</h1>
            <label> {editedCategory ? `Edit category ${editedCategory.name}`: 'Create new category'}</label>

            <form onSubmit={saveCategory} className="flex gap-1">
                <div className="flex gap-1">
                    <input type="text" placeholder={'Category name'} onChange={ev => setName(ev.target.value) } value={name}/>
                    <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category.id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button onClick={addProperty} type="button" className="btn-default text-sm mb-2">Add new property</button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={property.name} className="flex gap-1 mb-2">
                            <input
                                type="text"
                                value={property.name}
                                className="mb-0"
                                onChange={ev => handlePropertyNameChange(index,
                                property,ev.target.value)}
                                placeholder="property name (example: color)"/>
                            <input
                                type="text"
                                className="mb-0"
                                onChange={ev => handlePropertyValueChange(index,
                                property,ev.target.value)}
                                value={property.values}
                                placeholder="values, comma seperated"/>
                            <button type="button" className="btn-red" onClick={() => removeProperty(index)}>Remove</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties([]);
                            }}
                                className="btn-default">Cancel</button>

                    )}

                    <button type="submit" className="btn-primary p-1">Save</button>
                </div>
            </form>
            {editCategory && (
                <table className="basic mt-4">
                <thead>
                <tr>
                    <td>Category Name</td>
                    <td>Parent category</td>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                {categories.length > 0 && categories.map(category => (
                    <tr>
                        <td>{category.name}</td>
                        <td>{category?.parent?.name}</td>
                        <td>
                            <button onClick={() => editCategory(category)} className="btn-default mr-1">Edit</button>
                            <button onClick={() => deleteCategory(category) } className="btn-red">Delete</button>
                        </td>
                    </tr>

                ))}
                </tbody>
            </table>

        )}
        </Layout>
    )

}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
))
