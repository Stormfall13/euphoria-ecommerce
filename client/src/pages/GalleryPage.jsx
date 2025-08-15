import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";


const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchImages = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/images`);
                if (!res.ok) throw new Error("Ошибка загрузки изображений");
                const data = await res.json();
                setImages(data);
            } catch (error) {
                console.error("Ошибка:", error);
            }
        };

        fetchImages();
    }, [token, navigate]);

    const deleteImage = async (id) => {
        if (!window.confirm("Удалить изображение?")) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/images/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Ошибка удаления");
            setImages(images.filter(img => img.id !== id));
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const uploadImage = async () => {
        if (!selectedFile) {
            alert("Выберите файл!");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/images/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Ошибка загрузки");

            const newImage = await res.json();
            setImages([...images, newImage]); // Обновляем список изображений
            setSelectedFile(null); // Очищаем выбор файла
            document.getElementById("fileInput").value = ""; // Сбрасываем input
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div className="gallery-container">
            <Header />
            <h1>Галерея</h1>
            {/* Форма для загрузки изображения */}
            <div className="upload-section">
                <input 
                    type="file" 
                    id="fileInput"
                    onChange={(e) => setSelectedFile(e.target.files[0])} 
                />
                <button onClick={uploadImage}>Загрузить</button>
            </div>

            <div className="gallery" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {images.length === 0 ? (
                    <p>Нет изображений</p>
                ) : (
                    images.map((image) => (
                        <div key={image.id} className="gallery-item">
                            <img style={{ width: 100, height: 100 }} src={`${process.env.REACT_APP_API_URL}${image.filepath}`} alt={image.filename} />
                            <button onClick={() => deleteImage(image.id)}>Удалить</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GalleryPage;
