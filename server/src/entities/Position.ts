import { registerEnumType } from 'type-graphql';

// export enum Role {
// 	Offense,
// 	Defense,
// }
// export enum SubRole {
// 	OffBoth = Role.Offense,
// 	OffRush = Role.Offense,
// 	OffPass = Role.Offense,
// 	OffLine = Role.Offense,
// 	OffQB = Role.Offense,
// 	OffSpecial = Role.Offense,
// 	DefLB = Role.Defense,
// 	DefBase = Role.Defense,
// 	DefLine = Role.Defense,
// 	DefBack = Role.Defense,
// 	DefSpecial = Role.Defense,
// }
// export enum Position2 {
// 	QB = SubRole.OffQB,
// 	RB = SubRole.OffRush,
// 	WR = SubRole.OffPass,
// 	TE = SubRole.OffBoth,
// 	LB = SubRole.DefLB,
// 	T = SubRole.OffLine,
// 	G = SubRole.OffLine,
// 	C = SubRole.OffLine,
// 	DE = SubRole.DefLine,
// 	DT = SubRole.DefLine,
// 	CB = SubRole.DefBack,
// 	S = SubRole.DefBack,
// 	P = SubRole.DefSpecial,
// 	K = SubRole.OffSpecial,
// }

export enum Position {
	QB,
	RB,
	WR,
	TE,
	LB,
	T,
	G,
	C,
	DE,
	DT,
	CB,
	S,
	P,
	K,
}

registerEnumType(Position, {
	name: 'Position',
});
