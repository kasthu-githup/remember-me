import React from 'react';
import {
  Plus,
  Search,
  Grid,
  List,
  ArrowUpDown,
  Sparkles,
  CheckCircle,
  Briefcase,
  User,
  Heart,
  DollarSign,
  GraduationCap,
  Users,
} from 'lucide-react';
import { Reminder, Category, Priority } from '../types';
import { useReminders } from '../context/RemindersContext';
import { ReminderCard } from '../components/ReminderCard';

interface RemindersPageProps {
  onOpenCreateModal: () => void;
  onEditReminder: (reminder: Reminder) => void;
}

export const RemindersPage: React.FC<RemindersPageProps> = ({
  onOpenCreateModal,
  onEditReminder,
}) => {
  const {
    filteredReminders,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
  } = useReminders();

  const categories: { id: Category; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Categories', icon: Sparkles },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'study', label: 'Study', icon: GraduationCap },
    { id: 'family', label: 'Family', icon: Users },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>My Reminders</span>
            <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40">
              {filteredReminders.length} Results
            </span>
          </h1>
          <p className="text-[14px] text-[#B8B8B8] mt-1">
            Track, filter, and schedule your priorities with exact alarm triggers in Asia/Kolkata
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="py-2.5 px-4 rounded-xl btn-gold text-black font-bold text-[14px] shadow-md shadow-[#D4AF37]/25 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Filter and Search Center */}
      <div className="rounded-2xl bg-[#191919] p-4 sm:p-5 border border-[#D4AF37]/25 shadow-md space-y-4">
        {/* Search & View Modes */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, description or #tag..."
              className="w-full pl-10 pr-4 py-2 text-[14px] rounded-xl bg-[#141414] border border-[#D4AF37]/30 text-white placeholder-[#7A7A7A] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sort Select */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141414] border border-[#D4AF37]/30 text-[14px]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#B8B8B8] font-semibold focus:outline-none text-[14px]"
              >
                <option value="date-asc" className="bg-[#191919]">Date (Earliest)</option>
                <option value="date-desc" className="bg-[#191919]">Date (Latest)</option>
                <option value="priority-desc" className="bg-[#191919]">Priority (High to Low)</option>
                <option value="title" className="bg-[#191919]">Title (A-Z)</option>
              </select>
            </div>

            {/* View Mode Grid/List */}
            <div className="flex items-center bg-[#141414] p-1 rounded-xl border border-[#D4AF37]/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#D4AF37] text-black shadow-sm font-bold'
                    : 'text-[#7A7A7A] hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#D4AF37] text-black shadow-sm font-bold'
                    : 'text-[#7A7A7A] hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#D4AF37] text-black border-[#F5D76E] shadow-sm font-bold'
                    : 'bg-[#141414] border-[#D4AF37]/20 text-[#B8B8B8] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Priority & Status Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D4AF37]/20 text-[12px]">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#7A7A7A] font-semibold mr-1">Priority:</span>
            {(['all', 'high', 'medium', 'low'] as (Priority | 'all')[]).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all border ${
                  selectedPriority === p
                    ? p === 'high'
                      ? 'bg-red-950 text-red-200 border-red-500'
                      : p === 'medium'
                      ? 'bg-[#D4AF37] text-black border-[#F5D76E]'
                      : 'bg-[#222222] text-[#F5D76E] border-[#D4AF37]'
                    : 'border-transparent text-[#B8B8B8] hover:bg-[#202020]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#7A7A7A] font-semibold mr-1">Status:</span>
            {(['all', 'pending', 'completed', 'overdue'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all border ${
                  statusFilter === s
                    ? 'bg-[#D4AF37] text-black border-[#F5D76E]'
                    : 'border-transparent text-[#B8B8B8] hover:bg-[#202020]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reminders List / Grid */}
      {filteredReminders.length === 0 ? (
        <div className="rounded-2xl bg-[#191919] p-12 text-center border border-[#D4AF37]/25 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-[21px] font-bold text-white">
            No matching reminders found
          </h3>
          <p className="text-[14px] text-[#B8B8B8] mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a brand new reminder.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="mt-5 px-5 py-2.5 rounded-xl btn-gold text-black text-[14px] font-bold shadow-md shadow-[#D4AF37]/20 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Reminder</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEdit={onEditReminder}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEdit={onEditReminder}
              viewMode="list"
            />
          ))}
        </div>
      )}
    </div>
  );
};
