import {SimulationResult} from "../../model/simulation/SimulationResult.ts";

export function countDaysBetween(start: Date, end: Date) {
    return Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24));
}

export function countDaysSimulated(result: SimulationResult) {
    return countDaysBetween(
        new Date(result.userPortfolios[0].date),
        new Date(result.userPortfolios[result.userPortfolios.length - 1].date)
    );
}