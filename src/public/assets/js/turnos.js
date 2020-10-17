const obtenerTurnos = async () => {

    const result = await fetch("/api/turnos");

    const turnos = await result.json();

    return turnos;
}
