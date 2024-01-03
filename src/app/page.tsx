"use client";
import React, { FormEvent, useState } from "react";
import axios from "axios";

interface FormValues {
  nombre: string;
  edad: string;
  direccion: string;
}

export default function Page() {
  const [cambiarBoton, setCambiarBoton] = useState(false);

  const logeoUsuario = async (e: FormEvent) => {
    e.preventDefault();
    setCambiarBoton(true);

    const formData = new FormData(e.target as HTMLFormElement);

    const enviarDatos: FormValues = {
      nombre: formData.get("nombre")?.toString() || "",
      edad: formData.get("edad")?.toString() || "",
      direccion: formData.get("direccion")?.toString() || "",
    };

    console.log(enviarDatos);

    try {
      const response = await axios.post(
        "https://generarword.onrender.com/generar",
        enviarDatos, 
        {
          responseType: "blob", // Solicita la respuesta como un Blob
        }
      );

      const nombreparaeltituloword = response.headers['content-disposition'];
  
      if (response.data) {
        // Convierte el Blob a un documento Word y descárgalo
        const blob = new Blob([response.data], { type: "application/msword" }); // Ajusta el tipo MIME según sea necesario

        // Crea un enlace de descarga
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${nombreparaeltituloword}.docx`; // Cambia el nombre del archivo según tus necesidades

        // Simula un clic en el enlace para iniciar la descarga
        link.click();

        // Libera el objeto URL creado
        URL.revokeObjectURL(link.href); // Cambia el nombre del archivo según tus necesidades
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCambiarBoton(false);
    }
  };

  return (
    <div>
      <form
        className="flex flex-col justify-center items-center h-screen gap-5"
        onSubmit={logeoUsuario}
      >
        <input type="text" placeholder="Escribe tu nombre" name="nombre" />
        <input type="text" placeholder="Escribe tu edad" name="edad" />
        <input
          type="text"
          placeholder="Escribe tu dirección"
          name="direccion"
        />

        <button
          type="submit"
          className={`px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white ${
            cambiarBoton ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={cambiarBoton}
        >
          GENERAR WORD
        </button>
      </form>
    </div>
  );
}
