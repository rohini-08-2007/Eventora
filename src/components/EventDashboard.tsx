import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BudgetItem, ChecklistItem, TimelineItem, BookingRecord } from '../types';
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Heart,
  TrendingUp,
  AlertCircle,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const EventDashboard: React.FC = () => {
  const {
    currentEvent,
    updateEventDetails,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    toggleChecklistTask,
    addChecklistTask,
    deleteChecklistTask,
    addTimelineItem,
    updateTimelineItem,
    deleteTimelineItem,
    updateBookingStatus,
    savedVendors,
    setSelectedVendorForDetail,
    setActiveTab,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'budget' | 'checklist' | 'timeline' | 'bookings' | 'saved'>('budget');

  // Budget modal/add form state
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('Decoration');
  const [newBudgetServiceName, setNewBudgetServiceName] = useState('');
  const [newBudgetAllocated, setNewBudgetAllocated] = useState('');

  // Checklist add form state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState<'before' | 'event_day'>('before');

  // Timeline add form state
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newTimelineTitle, setNewTimelineTitle] = useState('');
  const [newTimelineDesc, setNewTimelineDesc] = useState('');

  // Editing budget item
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  // Calculations for Budget Tracker
  const totalBudget = currentEvent.budget;
  const totalAllocated = currentEvent.budgetItems.reduce((acc, item) => acc + item.allocatedAmount, 0);
  const totalSpent = currentEvent.budgetItems.reduce((acc, item) => acc + item.spentAmount, 0);
  const remainingBudget = totalBudget - totalAllocated;
  const budgetUtilizationPercent = Math.min(100, Math.round((totalAllocated / totalBudget) * 100));

  // Calculations for Tasks
  const completedTasksCount = currentEvent.checklist.filter(t => t.completed).length;
  const totalTasksCount = currentEvent.checklist.length;
  const taskCompletionPercent = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  const handleAddBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetServiceName.trim() || !newBudgetAllocated) return;
    addBudgetItem({
      category: newBudgetCategory,
      serviceName: newBudgetServiceName.trim(),
      allocatedAmount: Number(newBudgetAllocated) || 0,
      spentAmount: Number(newBudgetAllocated) || 0,
      status: 'Estimated',
    });
    setNewBudgetServiceName('');
    setNewBudgetAllocated('');
    setIsAddingBudget(false);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addChecklistTask({
      title: newTaskTitle.trim(),
      phase: newTaskPhase,
      completed: false,
      dueDate: currentEvent.date,
    });
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const handleAddTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime || !newTimelineTitle.trim()) return;
    addTimelineItem({
      time: newTime,
      title: newTimelineTitle.trim(),
      description: newTimelineDesc.trim(),
      status: 'upcoming',
    });
    setNewTime('');
    setNewTimelineTitle('');
    setNewTimelineDesc('');
    setIsAddingTimeline(false);
  };

  const saveEditedBudget = (id: string) => {
    updateBudgetItem(id, { allocatedAmount: editPrice, spentAmount: editPrice });
    setEditingBudgetId(null);
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Celebration Summary Card */}
        <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden mb-8 border border-stone-800">
          {/* Subtle Warm Decorative Lights Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Event Details */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>My Event Plan</span>
              </div>
              
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {currentEvent.title}
              </h1>

              {/* Badges / Key Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-2">
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{currentEvent.location}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{currentEvent.date}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="tabular-nums">{currentEvent.guestCount} Guests</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                  <span className="tabular-nums">₹{currentEvent.budget.toLocaleString('en-IN')} Budget</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Progress Gauges */}
            <div className="flex items-center gap-4 sm:gap-6 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              
              {/* Task Progress */}
              <div className="text-center">
                <div className="text-2xl font-bold text-white tabular-nums">
                  {completedTasksCount} / {totalTasksCount}
                </div>
                <div className="text-[11px] text-stone-300 uppercase font-semibold">
                  Tasks Done ({taskCompletionPercent}%)
                </div>
              </div>

              <div className="h-10 w-px bg-white/20" />

              {/* Budget Progress */}
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 tabular-nums">
                  ₹{remainingBudget.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-stone-300 uppercase font-semibold">
                  Remaining Budget
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Navigation Tabs for Dashboard Sections */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-stone-200">
          <button
            onClick={() => setActiveSubTab('budget')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'budget'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200'
            }`}
          >
            <IndianRupee className="w-4 h-4" />
            <span>Budget Tracker</span>
          </button>

          <button
            onClick={() => setActiveSubTab('checklist')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'checklist'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Event Checklist ({completedTasksCount}/{totalTasksCount})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'timeline'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Day-of Timeline</span>
          </button>

          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'bookings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings & Requests ({currentEvent.bookedServices.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('saved')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'saved'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Saved Vendors ({savedVendors.length})</span>
          </button>
        </div>

        {/* SECTION 1: BUDGET TRACKER */}
        {activeSubTab === 'budget' && (
          <div className="space-y-8">
            
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Total Event Budget
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                  ₹{totalBudget.toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Target ceiling for all vendor contracts
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Allocated / Committed
                  </span>
                  <span className="text-xs font-bold text-rose-600 tabular-nums">
                    {budgetUtilizationPercent}%
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                  ₹{totalAllocated.toLocaleString('en-IN')}
                </div>
                {/* Progress bar */}
                <div className="mt-3 w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${budgetUtilizationPercent}%` }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Remaining Buffer
                </span>
                <div
                  className={`text-2xl sm:text-3xl font-bold tabular-nums ${
                    remainingBudget >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  ₹{remainingBudget.toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {remainingBudget >= 0 ? 'Available for emergency or extra sweets' : 'Exceeded budget allocation'}
                </div>
              </div>

            </div>

            {/* Expense Breakdown Cards & Manual Price Editing */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Services Expense Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any price to manually edit your allocated amount or add custom items.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingBudget(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Expense</span>
                </button>
              </div>

              {/* Add Expense Form Modal Inline */}
              {isAddingBudget && (
                <form
                  onSubmit={handleAddBudgetSubmit}
                  className="p-4 mb-6 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                    <select
                      value={newBudgetCategory}
                      onChange={(e) => setNewBudgetCategory(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium cursor-pointer"
                    >
                      <option value="Venue">Venue</option>
                      <option value="Decoration">Decoration</option>
                      <option value="Catering">Catering</option>
                      <option value="Photography">Photography</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Other">Other Miscellaneous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Item / Vendor</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wedding Cake, Dhol players"
                      value={newBudgetServiceName}
                      onChange={(e) => setNewBudgetServiceName(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Allocated (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="5000"
                      value={newBudgetAllocated}
                      onChange={(e) => setNewBudgetAllocated(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      Save Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingBudget(false)}
                      className="py-2 px-3 border border-stone-300 text-slate-600 rounded-lg text-xs font-medium hover:bg-stone-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Items List */}
              <div className="divide-y divide-stone-100">
                {currentEvent.budgetItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-xs text-slate-700">
                        {item.category.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {item.category}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-xs text-slate-600">{item.serviceName}</span>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      {editingBudgetId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-24 border border-rose-400 rounded-lg px-2 py-1 text-xs font-bold tabular-nums"
                          />
                          <button
                            onClick={() => saveEditedBudget(item.id)}
                            className="p-1 bg-emerald-600 text-white rounded cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingBudgetId(item.id);
                            setEditPrice(item.allocatedAmount);
                          }}
                          className="text-right cursor-pointer group-hover:text-rose-600 transition-colors"
                          title="Click to edit price"
                        >
                          <div className="text-base font-bold text-slate-900 tabular-nums">
                            ₹{item.allocatedAmount.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                            <Edit2 className="w-2.5 h-2.5" /> Edit
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => deleteBudgetItem(item.id)}
                        className="p-1.5 text-stone-300 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* SECTION 2: EVENT CHECKLIST (TASKS) */}
        {activeSubTab === 'checklist' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Event Checklist & Action Tasks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing <span className="font-bold text-slate-800">{completedTasksCount} / {totalTasksCount}</span> tasks completed
                </p>
              </div>

              <button
                onClick={() => setIsAddingTask(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Inline Add Task Form */}
            {isAddingTask && (
              <form
                onSubmit={handleAddTaskSubmit}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row gap-3 items-end"
              >
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Call decorator for stage dimensions"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Phase</label>
                  <select
                    value={newTaskPhase}
                    onChange={(e) => setNewTaskPhase(e.target.value as 'before' | 'event_day')}
                    className="bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium cursor-pointer"
                  >
                    <option value="before">Before Event</option>
                    <option value="event_day">Event Day</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="py-2 px-4 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="py-2 px-3 border border-stone-300 text-slate-600 rounded-lg text-xs hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Before Event Phase */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-3 flex items-center gap-1.5">
                <span>Before Event</span>
              </h4>
              <div className="space-y-2">
                {currentEvent.checklist
                  .filter((t) => t.phase === 'before')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleChecklistTask(task.id)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        task.completed
                          ? 'bg-stone-50 border-stone-200 text-slate-400'
                          : 'bg-white border-stone-200 text-slate-800 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-300 shrink-0" />
                        )}
                        <span
                          className={`text-xs font-semibold ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {task.dueDate && (
                          <span className="text-[11px] text-slate-400">{task.dueDate}</span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChecklistTask(task.id);
                          }}
                          className="text-stone-300 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Event Day Phase */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5">
                <span>Event Day Checklist</span>
              </h4>
              <div className="space-y-2">
                {currentEvent.checklist
                  .filter((t) => t.phase === 'event_day')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleChecklistTask(task.id)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        task.completed
                          ? 'bg-stone-50 border-stone-200 text-slate-400'
                          : 'bg-white border-stone-200 text-slate-800 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-300 shrink-0" />
                        )}
                        <span
                          className={`text-xs font-semibold ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {task.dueDate && (
                          <span className="text-[11px] text-slate-400">{task.dueDate}</span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChecklistTask(task.id);
                          }}
                          className="text-stone-300 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}

        {/* SECTION 3: EVENT TIMELINE */}
        {activeSubTab === 'timeline' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Event Day Schedule & Milestones
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Editable run-down of your celebration schedule from morning setup to farewell.
                </p>
              </div>

              <button
                onClick={() => setIsAddingTimeline(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Time Slot</span>
              </button>
            </div>

            {/* Inline Add Timeline Item Form */}
            {isAddingTimeline && (
              <form
                onSubmit={handleAddTimelineSubmit}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 03:30 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Milestone Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cake cutting ceremony"
                    value={newTimelineTitle}
                    onChange={(e) => setNewTimelineTitle(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    Add Slot
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingTimeline(false)}
                    className="py-2 px-3 border border-stone-300 text-slate-600 rounded-lg text-xs hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Timeline Vertical Track */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-rose-200 space-y-6 my-4">
              {currentEvent.timeline.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Pin Dot on line */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-white border-4 border-rose-500 shadow-xs" />

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 group-hover:border-stone-300 transition-all">
                    <div>
                      <span className="text-xs font-bold text-rose-600 tabular-nums block mb-0.5">
                        {item.time}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                      )}
                    </div>

                    <button
                      onClick={() => deleteTimelineItem(item.id)}
                      className="text-stone-300 hover:text-rose-600 transition-colors cursor-pointer self-end sm:self-start"
                      title="Remove timeline item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SECTION 4: BOOKINGS & REQUESTS */}
        {activeSubTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Booked Services & Requests
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track vendor confirmation status, invoices, and communication.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                + Book New Service
              </button>
            </div>

            {currentEvent.bookedServices.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No active service bookings yet. Browse the marketplace to connect with verified providers.
              </div>
            ) : (
              <div className="space-y-4">
                {currentEvent.bookedServices.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-rose-600 uppercase">
                          {booking.category}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-xs text-slate-500">{booking.location}</span>
                      </div>
                      <h4 className="font-display text-base font-bold text-slate-900">
                        {booking.vendorName}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Package: <span className="font-semibold">{booking.packageName}</span>
                      </p>
                      {booking.notes && (
                        <p className="text-xs text-slate-400 mt-1 italic">
                          "{booking.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <div className="text-lg font-bold text-slate-900 tabular-nums">
                        ₹{booking.price.toLocaleString('en-IN')}
                      </div>

                      {/* Status badge with interactive simulator */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                            booking.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : booking.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : booking.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {booking.status}
                        </span>

                        <select
                          value={booking.status}
                          onChange={(e) =>
                            updateBookingStatus(
                              booking.id,
                              e.target.value as BookingRecord['status']
                            )
                          }
                          className="bg-white border border-stone-300 rounded-md text-[11px] font-semibold text-slate-700 py-0.5 px-1 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* SECTION 5: SAVED VENDORS */}
        {activeSubTab === 'saved' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Bookmarked & Saved Providers
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Providers you've saved while exploring Vizag event vendors.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('explore')}
                className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
              >
                Browse more vendors
              </button>
            </div>

            {savedVendors.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                You haven't saved any vendors yet. Click the heart icon on any vendor card to bookmark them here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={vendor.images[0]}
                        alt={vendor.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <div className="text-[10px] font-bold uppercase text-rose-600">
                          {vendor.category}
                        </div>
                        <h4 className="font-display text-sm font-bold text-slate-900 line-clamp-1">
                          {vendor.name}
                        </h4>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{vendor.locality}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        ₹{vendor.startingPrice.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => setSelectedVendorForDetail(vendor)}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
